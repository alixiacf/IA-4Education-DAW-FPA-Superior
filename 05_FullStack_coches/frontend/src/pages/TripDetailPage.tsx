import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Users, Car, Calendar, Fuel, Info } from 'lucide-react';
import { fetchTrip, joinTrip } from '../lib/api';
import type { Trip } from '../types';

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    fetchTrip(id)
      .then(setTrip)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleJoinTrip = async () => {
    if (!id || !trip || trip.viajerosConfirmados >= trip.viajerosNecesarios) return;

    setJoining(true);
    setError(null);

    try {
      const updatedTrip = await joinTrip(id);
      setTrip(updatedTrip);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al unirse al viaje');
    } finally {
      setJoining(false);
    }
  };

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

  if (!trip) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
        No se encontró el viaje
      </div>
    );
  }

  const isAvailable = trip.viajerosConfirmados < trip.viajerosNecesarios;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">{trip.destino}</h1>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isAvailable ? 'Disponible' : 'Completo'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {format(new Date(trip.fecha), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                </span>
              </div>

              <div className="flex items-center">
                <Car className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">{trip.carModel}</span>
              </div>

              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {trip.viajerosConfirmados} de {trip.viajerosNecesarios} viajeros
                </span>
              </div>

              <div className="flex items-center">
                <Fuel className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {trip.tipoCombustible} - {trip.consumoMedio}L/100km
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Viaje</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Distancia: {trip.kilometros} km</p>
                <p>Precio combustible: {trip.precioCombustible}€/L</p>
                <p>Conductor: {trip.conductor}</p>
                <p className="font-medium text-lg text-blue-600">
                  Precio por persona: {trip.precioPorViajero.toFixed(2)}€
                </p>
              </div>
            </div>
          </div>

          {trip.notas && (
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Info className="w-5 h-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Notas</h2>
              </div>
              <p className="text-gray-600 whitespace-pre-line">{trip.notas}</p>
            </div>
          )}

          {isAvailable && (
            <div className="flex justify-end">
              <button
                onClick={handleJoinTrip}
                disabled={joining}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {joining ? 'Uniéndose...' : 'Unirse al Viaje'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}