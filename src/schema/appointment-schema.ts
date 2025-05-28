export interface Appointment {
  id: string;
  createdAt: string; // ISO timestamp
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string; // ISO timestamp
  specialization: string;
  message: string;
}

export interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AppointmentResponse {
  data: Appointment[];
  meta: Meta;
}
