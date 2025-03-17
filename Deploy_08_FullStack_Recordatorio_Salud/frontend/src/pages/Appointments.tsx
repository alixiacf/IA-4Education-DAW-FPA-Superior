import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Trash2, Bell } from 'lucide-react';
import { 
  Appointment, 
  getAppointments, 
  createAppointment, 
  deleteAppointment,
  createNotification as apiCreateNotification
} from '../lib/api';

export default function Appointments() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialty: '',
    appointment_date: '',
    location: '',
    notes: '',
    reminder_minutes: 30
  });

  const reminderOptions = [
    { value: 15, label: '15 minutos antes' },
    { value: 30, label: '30 minutos antes' },
    { value: 60, label: '1 hora antes' },
    { value: 120, label: '2 horas antes' },
    { value: 1440, label: '1 día antes' }
  ];

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data || []);

      // Verificar y crear notificaciones para citas próximas
      data?.forEach(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        const reminderDate = new Date(appointmentDate.getTime() - (appointment.reminder_minutes * 60 * 1000));
        const now = new Date();

        if (reminderDate > now && appointmentDate > now) {
          const timeoutMs = reminderDate.getTime() - now.getTime();
          setTimeout(async () => {
            await createNotification(appointment);
          }, timeoutMs);
        }
      });
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      toast.error('Error al cargar las citas médicas');
    }
  };

  // Función para crear notificaciones usando la API
  const createNotification = async (appointment: Appointment) => {
    try {
      // Llamamos a la API para crear la notificación
      await apiCreateNotification({
        message: `Recordatorio: Tienes una cita con ${appointment.doctor_name} en ${appointment.reminder_minutes} minutos`,
        type: 'push',
        appointment_id: appointment.id
      });
      
      // También mostramos un toast como notificación visual inmediata
      toast(`Recordatorio: Tienes una cita con ${appointment.doctor_name} en ${appointment.reminder_minutes} minutos`);
    } catch (error) {
      console.error('Error al crear la notificación:', error);
      // Si falla la API, al menos mostramos el toast
      toast(`Recordatorio: Tienes una cita con ${appointment.doctor_name} en ${appointment.reminder_minutes} minutos`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Enviando datos de cita:', formData);
      
      // Verificar que tenemos un token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token de autenticación almacenado');
        toast.error('No has iniciado sesión. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }
      
      console.log('Token disponible:', token.substring(0, 10) + '...');
      
      // Crear la cita a través de la API
      const appointmentData = await createAppointment({
        doctor_name: formData.doctor_name,
        specialty: formData.specialty,
        appointment_date: formData.appointment_date,
        location: formData.location,
        notes: formData.notes,
        reminder_minutes: formData.reminder_minutes
      });

      console.log('Respuesta del servidor:', appointmentData);
      
      toast.success('Cita médica creada exitosamente');
      setShowForm(false);
      setFormData({
        doctor_name: '',
        specialty: '',
        appointment_date: '',
        location: '',
        notes: '',
        reminder_minutes: 30
      });
      fetchAppointments();
    } catch (error: any) {
      console.error('Error al crear cita:', error);
      
      // Manejar diferentes tipos de errores para dar feedback más preciso
      if (error.response) {
        // El servidor respondió con un código de error
        console.error('Error del servidor:', error.response.data);
        toast.error(`Error: ${error.response.data.message || 'Error del servidor'}`);
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Error al configurar la petición
        toast.error(`Error al crear la cita médica: ${error.message || 'Error desconocido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      toast.success('Cita eliminada exitosamente');
      fetchAppointments();
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      toast.error('Error al eliminar la cita');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold">Tus Citas Médicas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Nueva Cita
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Nueva Cita Médica</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-700">
                Nombre del Doctor
              </label>
              <input
                type="text"
                id="doctor_name"
                required
                value={formData.doctor_name}
                onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                Especialidad
              </label>
              <input
                type="text"
                id="specialty"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700">
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                id="appointment_date"
                required
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="reminder_minutes" className="block text-sm font-medium text-gray-700">
                Recordatorio
              </label>
              <select
                id="reminder_minutes"
                value={formData.reminder_minutes}
                onChange={(e) => setFormData({ ...formData, reminder_minutes: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {reminderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notas
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cita'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">No hay citas programadas</p>
              </div>
            </li>
          ) : (
            appointments.map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-medium text-indigo-600">{appointment.doctor_name}</div>
                      <div className="text-sm text-gray-500">{appointment.specialty}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Bell className="h-4 w-4 mr-1" />
                        {reminderOptions.find(opt => opt.value === appointment.reminder_minutes)?.label}
                      </div>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {formatDate(appointment.appointment_date)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {appointment.location}
                  </div>
                  
                  {appointment.notes && (
                    <div className="text-sm text-gray-500 mt-2">
                      <p className="font-medium">Notas:</p>
                      <p className="mt-1">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}