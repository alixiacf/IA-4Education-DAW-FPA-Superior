import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Car } from 'lucide-react';
import { createTrip, searchCars } from '../lib/api';
import type { Car as CarType, TripInput } from '../types';

export function NewTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carQuery, setCarQuery] = useState('');
  const [cars, setCars] = useState<CarType[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [showCarResults, setShowCarResults] = useState(false);

  const [formData, setFormData] = useState<Partial<TripInput>>({
    destino: '',
    kilometros: 0,
    viajerosNecesarios: 1,
    precioCombustible: 0,
    conductor: '',
    notas: '',
  });

  useEffect(() => {
    if (carQuery.trim()) {
      const searchTimeout = setTimeout(async () => {
        try {
          const results = await searchCars(carQuery);
          setCars(results);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al buscar coches');
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setCars([]);
    }
  }, [carQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) {
      setError('Por favor selecciona un coche');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tripData: TripInput = {
        ...formData as TripInput,
        carModel: `${selectedCar.marca} ${selectedCar.modelo}`,
        consumoMedio: selectedCar.consumoMedio,
        tipoCombustible: selectedCar.tipoCombustible,
      };

      const response = await createTrip(tripData);
      console.log("Respuesta al crear viaje:", response);
      
      if (response.viaje && response.viaje._id) {
        navigate(`/trips/${response.viaje._id}`);
      } else if (response.redirect) {
        navigate(response.redirect);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el viaje');
      setLoading(false);
    }
  };

  const handleCarSelect = (car: CarType) => {
    setSelectedCar(car);
    setCarQuery(`${car.marca} ${car.modelo}`);
    setShowCarResults(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Nuevo Viaje</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="destino" className="block text-sm font-medium text-gray-700">
                Destino
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="destino"
                  required
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="car" className="block text-sm font-medium text-gray-700">
                Coche
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Car className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="car"
                  value={carQuery}
                  onChange={(e) => {
                    setCarQuery(e.target.value);
                    setShowCarResults(true);
                  }}
                  onFocus={() => setShowCarResults(true)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar coche..."
                />
                {showCarResults && cars.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                    {cars.map((car) => (
                      <button
                        key={car._id}
                        type="button"
                        onClick={() => handleCarSelect(car)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {car.marca} {car.modelo} - {car.consumoMedio}L/100km
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="kilometros" className="block text-sm font-medium text-gray-700">
                  Kilómetros
                </label>
                <input
                  type="number"
                  id="kilometros"
                  min="0"
                  required
                  value={formData.kilometros}
                  onChange={(e) => setFormData({ ...formData, kilometros: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="precioCombustible" className="block text-sm font-medium text-gray-700">
                  Precio Combustible (€/L)
                </label>
                <input
                  type="number"
                  id="precioCombustible"
                  min="0"
                  step="0.001"
                  required
                  value={formData.precioCombustible}
                  onChange={(e) => setFormData({ ...formData, precioCombustible: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="viajerosNecesarios" className="block text-sm font-medium text-gray-700">
                Viajeros Necesarios
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="viajerosNecesarios"
                  min="1"
                  required
                  value={formData.viajerosNecesarios}
                  onChange={(e) => setFormData({ ...formData, viajerosNecesarios: Number(e.target.value) })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="conductor" className="block text-sm font-medium text-gray-700">
                Conductor
              </label>
              <input
                type="text"
                id="conductor"
                required
                value={formData.conductor}
                onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
                Notas
              </label>
              <textarea
                id="notas"
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Viaje'}
          </button>
        </div>
      </form>
    </div>
  );
}