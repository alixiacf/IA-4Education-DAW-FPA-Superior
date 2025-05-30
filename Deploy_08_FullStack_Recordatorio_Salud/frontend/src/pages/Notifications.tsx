import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Notification, getNotifications, markNotificationAsRead, deleteAllNotifications } from '../lib/api';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      // Obtener todas las notificaciones usando la API
      const data = await getNotifications();
      
      // Filtrar según el estado seleccionado
      let filteredData = [...data];
      if (filter === 'unread') {
        filteredData = data.filter(n => n.status !== 'read');
      } else if (filter === 'read') {
        filteredData = data.filter(n => n.status === 'read');
      }
      
      setNotifications(filteredData || []);
    } catch (error) {
      console.error('Error al cargar las notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Esta funcionalidad debería implementarse en el backend
      // Por ahora, marcamos una por una
      const unreadNotifications = notifications.filter(n => n.status !== 'read');
      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id);
      }
      fetchNotifications();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const deleteAll = async () => {
    try {
      await deleteAllNotifications();
      fetchNotifications();
    } catch (error) {
      console.error('Error al eliminar notificaciones:', error);
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
      <h2 className="text-2xl font-bold mb-6">Notificaciones</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <button
              onClick={markAllAsRead}
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Marcar todo como leído
            </button>
            <button
              onClick={deleteAll}
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Limpiar todo
            </button>
          </div>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="all">Todas las notificaciones</option>
              <option value="unread">No leídas</option>
              <option value="read">Leídas</option>
            </select>
          </div>
        </div>

        <div className="border rounded-lg divide-y">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No hay notificaciones para mostrar
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex items-start justify-between ${
                  notification.status !== 'read' ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
                {notification.status !== 'read' && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}