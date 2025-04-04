
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  next_available: string;
  fee: number;
  education: string;
  experience: string;
  location: string;
  online: boolean;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  doctor_name: string; // Changed from optional to required
  patient_name: string; // Changed from optional to required
}

export interface AnalyticsData {
  totalUsers: number;
  totalDoctors: number;
  activeAppointments: number;
  totalRevenue: number;
}
