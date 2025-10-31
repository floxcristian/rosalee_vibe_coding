export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
}
