import React, { useState, useEffect } from 'react';
import { obtenerConsejo } from '../api';
import { Lightbulb } from 'lucide-react';

const HealthAdvice: React.FC = () => {
  const [consejo, setConsejo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsejo = async () => {
    try {
      setLoading(true);
      const data = await obtenerConsejo();
      setConsejo(data.consejo);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el consejo. Intenta de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsejo();
  }, []);

  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-3 mb-4">
        <Lightbulb className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-medium text-gray-800">Consejo Saludable</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <p className="text-gray-700">{consejo}</p>
      )}
      
      <button
        onClick={fetchConsejo}
        className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Nuevo consejo
      </button>
    </div>
  );
};

export default HealthAdvice;