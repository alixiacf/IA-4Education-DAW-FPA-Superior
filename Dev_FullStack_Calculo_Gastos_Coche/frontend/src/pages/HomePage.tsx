import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Users, Car as CarIcon } from 'lucide-react';
import { fetchTrips } from '../lib/api';
import type { Trip } from '../types';

export function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Viajes Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Link
            key={trip._id}
            to={`/trips/${trip._id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">{trip.destino}</h2>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <CarIcon className="w-4 h-4 mr-2" />
                  <span>{trip.carModel}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{trip.viajerosConfirmados} / {trip.viajerosNecesarios} viajeros</span>
                </div>
                <div className="text-sm">
                  {format(new Date(trip.fecha), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">
                  {trip.precioPorViajero.toFixed(2)}€ por persona
                </span>
                {trip.viajerosConfirmados < trip.viajerosNecesarios && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Disponible
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}