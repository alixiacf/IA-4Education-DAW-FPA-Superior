import axios from 'axios';

// URL fija del backend
const apiUrl = 'http://localhost:3000';
console.log('API URL:', apiUrl); // Debug para ver qué URL está usando

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Timeout para las peticiones
  timeout: 10000,
  // Permitir cookies y credenciales
  withCredentials: true,
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
export interface Appointment {
  id: string;
  doctor_name: string;
  specialty: string;
  appointment_date: string;
  location: string;
  notes: string | null;
  reminder_minutes: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'email' | 'push' | 'whatsapp';
  status: 'pending' | 'sent' | 'read';
  created_at: string;
}

// Auth
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/api/auth/register', { email, password });
  return response.data;
};

// Appointments
export const getAppointments = async () => {
  const response = await api.get<Appointment[]>('/api/appointments');
  return response.data;
};

export const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
  const response = await api.post<Appointment>('/api/appointments', appointment);
  return response.data;
};

export const deleteAppointment = async (id: string) => {
  await api.delete(`/api/appointments/${id}`);
};

// Notifications
export const getNotifications = async () => {
  const response = await api.get<Notification[]>('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  await api.patch(`/api/notifications/${id}/read`);
};

export const deleteAllNotifications = async () => {
  await api.delete('/api/notifications');
};

// Nueva función para crear una notificación
export const createNotification = async (notification: {
  message: string;
  type: 'email' | 'push' | 'whatsapp';
  appointment_id?: string;
}) => {
  const response = await api.post<Notification>('/api/notifications', notification);
  return response.data;
};