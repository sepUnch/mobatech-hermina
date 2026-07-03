package cron

import (
	"backend/models"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

// StartScheduleExpirationCron runs a background job every minute to mark expired schedules as unavailable.
// This ensures that the RAG/AI system and the frontend stay perfectly synced with the backend state.
func StartScheduleExpirationCron(db *gorm.DB) {
	ticker := time.NewTicker(1 * time.Minute)
	go func() {
		for {
			<-ticker.C
			runScheduleSweep(db)
		}
	}()
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
			
			// 2. Auto-cancel any appointments that are still pending/approved (No-Show / Palkor)
			db.Model(&models.Appointment{}).
				Where("doctor_schedule_id = ? AND status IN ?", s.ID, []string{"pending", "approved"}).
				Updates(map[string]interface{}{
					"status": "cancelled",
					"notes":  "Batal otomatis: Pasien tidak hadir hingga sesi praktik berakhir (No-Show)",
				})
				
			expiredCount++
		}
	}

	if expiredCount > 0 {
		log.Printf("ScheduleCron: Successfully marked %d expired schedules as unavailable.\n", expiredCount)
	}
}
