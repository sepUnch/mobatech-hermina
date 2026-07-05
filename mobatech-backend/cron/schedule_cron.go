package cron

import (
	"backend/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"gorm.io/gorm"
)

// StartScheduleExpirationCron runs a background job every minute to mark expired schedules as unavailable.
// This ensures that the RAG/AI system and the frontend stay perfectly synced with the backend state.
func StartScheduleExpirationCron(db *gorm.DB) {
	// Schedule expiry and unpaid booking release run every 30 minutes safely
	ticker := time.NewTicker(30 * time.Minute)
	go func() {
		for {
			<-ticker.C
			runScheduleSweep(db)
		}
	}()

	// Nightly RAG Sync and Garbage Collection at 00:00
	go runNightlyCron(db)
}

func runNightlyCron(db *gorm.DB) {
	for {
		now := time.Now()
		// Calculate time until next midnight
		next := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, now.Location())
		time.Sleep(time.Until(next))
		
		log.Println("[CRON] Executing Nightly 00:00 Tasks (RAG Sync & Garbage Collection)...")
		
		// 1. RAG Re-Index
		http.Post("http://localhost:8000/api/rag/sync", "application/json", nil)
		
		// 2. Garbage Collection: Auto-delete very old pending appointments (> 30 days) to keep DB lean
		db.Where("status = ? AND created_at < ?", "cancelled", now.AddDate(0, -1, 0)).Delete(&models.Appointment{})
	}
}

func runScheduleSweep(db *gorm.DB) {
	var schedules []models.DoctorSchedule
	// Only fetch schedules that are currently available to minimize processing overhead
	if err := db.Where("is_available = ?", true).Find(&schedules).Error; err != nil {
		log.Println("ScheduleCron Error fetching schedules:", err)
		return
	}

	now := time.Now()
	expiredCount := 0

	for _, s := range schedules {
		scheduleEndStr := fmt.Sprintf("%s %s", s.Date.Format("2006-01-02"), s.EndTime)
		var scheduleEnd time.Time
		var errParse error

		if len(s.EndTime) > 5 {
			scheduleEnd, errParse = time.ParseInLocation("2006-01-02 15:04:05", scheduleEndStr, time.Local)
		} else {
			scheduleEnd, errParse = time.ParseInLocation("2006-01-02 15:04", scheduleEndStr, time.Local)
		}

		if errParse == nil && now.After(scheduleEnd) {
			// 1. Mark schedule as unavailable
			s.IsAvailable = false
			db.Save(&s)

			// 2. Auto-cancel any appointments that are still pending/approved (No-Show)
			db.Model(&models.Appointment{}).
				Where("doctor_schedule_id = ? AND status IN ?", s.ID, []string{"pending", "approved"}).
				Updates(map[string]interface{}{
					"status": "cancelled",
					"notes":  "Batal otomatis: Pasien tidak hadir hingga sesi praktik berakhir (No-Show)",
				})

			expiredCount++
		}
	}

	// 3. Auto-Release Unpaid Bookings (Pending > 30 mins)
	thirtyMinsAgo := now.Add(-30 * time.Minute)
	var pendingAppointments []models.Appointment
	db.Where("status = ? AND created_at <= ?", "pending", thirtyMinsAgo).Find(&pendingAppointments)
	
	releasedCount := 0
	for _, appt := range pendingAppointments {
		db.Model(&appt).Updates(map[string]interface{}{
			"status": "cancelled",
			"notes":  "Batal otomatis: Waktu pembayaran/verifikasi habis (30 Menit)",
		})
		
		// Release the quota
		db.Model(&models.DoctorSchedule{}).Where("id = ? AND booked > 0", appt.DoctorScheduleID).
			UpdateColumn("booked", gorm.Expr("booked - 1"))
		releasedCount++
	}

	if releasedCount > 0 {
		log.Printf("ScheduleCron: Successfully released %d unpaid bookings.\n", releasedCount)
	}

	if expiredCount > 0 {
		log.Printf("ScheduleCron: Successfully marked %d expired schedules as unavailable.\n", expiredCount)
		// Trigger RAG Sync so AI knows about the expired schedules immediately
		go func() {
			resp, err := http.Post("http://localhost:8000/api/rag/sync", "application/json", nil)
			if err == nil {
				resp.Body.Close()
			}
		}()
	}
}
