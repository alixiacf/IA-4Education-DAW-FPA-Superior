import React, { useState, useEffect } from 'react';
import { Car, Search } from 'lucide-react';
import { fetchCars, searchCars } from '../lib/api';
import type { Car as CarType } from '../types';

export function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCars()
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchCars(query);
        setCars(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar coches');
      }
    } else {
      // Reset to all cars when search is cleared
      fetchCars().then(setCars);
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Car className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Coches</h1>
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por marca o modelo..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {car.marca} {car.modelo}
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Consumo medio:</span>{' '}
                {car.consumoMedio} L/100km
              </p>
              <p>
                <span className="font-medium">Tipo combustible:</span>{' '}
                {car.tipoCombustible}
              </p>
              <p>
                <span className="font-medium">Capacidad:</span>{' '}
                {car.capacidadPasajeros} pasajeros
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}