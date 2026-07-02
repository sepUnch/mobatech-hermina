export interface GormModel {
  id: number; created_at: string;
  updated_at: string; deleted_at?: string | null;
}
export interface User extends GormModel {
  full_name: string; email: string;
  role: string; phone_number: string;
  image_url?: string; blood_type?: string;
  height?: number; weight?: number;
  allergies?: string; date_of_birth?: string;
  gender?: string;
}
export interface LoginResponseData {
  token: string; user: User;
}
export interface Doctor extends GormModel {
  user_id?: number; polyclinic_id?: number;
  polyclinic?: Polyclinic; name: string;
  specialization: string; contact_info: string;
  description: string; image_url: string;
  is_active: boolean;
}
export interface DoctorSchedule extends GormModel {
  doctor_id: number; doctor?: Doctor;
  date: string; start_time: string;
  end_time: string; quota: number;
  booked: number; is_available: boolean;
}
export interface PolyclinicSchedule extends GormModel {
  polyclinic_id: number; day_of_week: string;
  start_time: string; end_time: string;
  is_available: boolean;
}
export interface Polyclinic extends GormModel {
  name: string; description: string;
  image_url: string; is_active: boolean;
  schedules?: PolyclinicSchedule[]; doctors?: Doctor[];
}
export interface Branch extends GormModel {
  name: string; address: string;
  latitude: number; longitude: number;
  image_url: string; gmaps_link: string;
}
export interface Appointment extends GormModel {
  user_id: number; user?: User;
  doctor_id: number; doctor?: Doctor;
  doctor_schedule_id: number; schedule?: DoctorSchedule;
  status: string; // pending, approved, cancelled, completed
  notes: string;
}
export interface EmergencyRequest extends GormModel {
  user_id: number; patient_name: string;
  condition: string; location: string;
  latitude: number; longitude: number;
  phone_number: string;
  status: string; // Pending, Dispatched, Arrived, Resolved
  ambulance_lat: number; ambulance_lng: number;
  estimated_minutes: number;
}
export interface MedicineCategory extends GormModel {
  name: string; description?: string;
}
export interface Medicine extends GormModel {
  name: string; generic_name: string;
  dosage: string; unit: string;
  price: number; stock: number;
  requires_prescription: boolean; category_id?: number;
  category?: MedicineCategory; image_url?: string;
}
export interface PharmacyOrderItem extends GormModel {
  order_id: number; medicine_id: number;
  medicine?: Medicine; quantity: number;
  subtotal: number;
}
export interface PharmacyOrder extends GormModel {
  order_number: string; user_id: number;
  user?: User; pickup_method: string;
  status: string; payment_status: string;
  total_price: number; delivery_address?: string;
  notes?: string; items?: PharmacyOrderItem[];
}
export interface RagStatus {
  status: string; vector_count: number;
  knowledge_base_size: number;
}
export interface ChatMessage {
  id: number;
  role: "user" | "model";
  content: string; created_at: string;
}
export interface ChatSession {
  id: number; user_id: string;
  title: string; updated_at: string;
  Messages: ChatMessage[];
}
export interface Reminder {
  id: number; created_at: string;
  user_id: number; appointment_id?: number;
  title: string; message: string;
  reminder_date: string; is_read: boolean;
  type: string;
}
export interface Promo extends GormModel {
  title: string; subtitle: string;
  themeColor: string; is_active: boolean;
}

export interface PrescriptionItem {
  medicine_id: number;
  medicine_name?: string;
  dosage: string;
  duration: string;
  quantity: number;
}
export interface Prescription extends GormModel {
  user_id: number;
  appointment_id: number;
  doctor_name: string;
  diagnosis: string;
  status: "pending" | "completed";
  items: PrescriptionItem[];
}
