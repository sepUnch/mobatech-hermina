export interface Appointment { id: number; status: string; created_at: string; notes: string; }
export interface Emergency { id: number; status: string; created_at: string; latitude: number; longitude: number; }
export interface User { id: number; full_name: string; email: string; created_at: string; }
export interface Doctor { id: number; name: string; }
export interface Polyclinic { id: number; name: string; }
export interface DoctorSchedule {
  id: number;
  doctor: { name: string; specialization: string };
  date: string;
  start_time: string;
  end_time: string;
  quota: number;
  booked: number;
  is_available: boolean;
}

export interface DashboardStats {
  doctors: number;
  polyclinics: number;
  patients: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  activeEmergencies: number;
  recentAppointments: Appointment[];
  recentEmergencies: Emergency[];
  recentPatients: User[];
  recentSchedules: DoctorSchedule[];
  loading: boolean;
}
