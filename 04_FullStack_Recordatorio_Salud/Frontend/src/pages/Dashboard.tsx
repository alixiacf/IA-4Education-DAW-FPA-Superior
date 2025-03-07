import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, Bell, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  doctor_name: string;
  specialty: string;
  appointment_date: string;
  location: string;
}

interface Notification {
  id: string;
  message: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Obtener próximas citas
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(3);

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

      // Obtener notificaciones recientes
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notificationsError) throw notificationsError;
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Bienvenido a tu Panel de Salud</h2>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Resumen Rápido</h3>
          <p className="text-gray-600">Bienvenido de nuevo, {user?.email}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-700 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recordatorios Activos
            </h4>
            <p className="text-indigo-600 mt-2">
              {loading ? 'Cargando...' : 'No hay recordatorios activos'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-700 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximas Citas
            </h4>
            {loading ? (
              <p className="text-green-600 mt-2">Cargando...</p>
            ) : appointments.length > 0 ? (
              <div className="space-y-2 mt-2">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="text-green-600 text-sm">
                    <p className="font-medium">{appointment.doctor_name}</p>
                    <p>{formatDate(appointment.appointment_date)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 mt-2">No hay citas próximas</p>
            )}
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-700 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notificaciones Recientes
            </h4>
            {loading ? (
              <p className="text-yellow-600 mt-2">Cargando...</p>
            ) : notifications.length > 0 ? (
              <div className="space-y-2 mt-2">
                {notifications.map(notification => (
                  <div key={notification.id} className="text-yellow-600 text-sm">
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-600 mt-2">No hay notificaciones recientes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}