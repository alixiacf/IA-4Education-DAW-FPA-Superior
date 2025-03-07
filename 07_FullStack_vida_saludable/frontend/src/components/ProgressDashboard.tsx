import React from 'react';
import { Usuario, Entrenamiento, Dieta } from '../types';
import { Activity, Utensils, Weight, Ruler } from 'lucide-react';

interface ProgressDashboardProps {
  usuario: Usuario;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ usuario }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular totales
  const totalCalorias = usuario.progreso.entrenamientos.reduce(
    (sum, entrenamiento) => sum + entrenamiento.calorias,
    0
  );
  
  const totalDuracion = usuario.progreso.entrenamientos.reduce(
    (sum, entrenamiento) => sum + entrenamiento.duracion,
    0
  );
  
  const totalCaloriasConsumidas = usuario.progreso.dietas.reduce(
    (sum, dieta) => sum + dieta.calorias,
    0
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Weight className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Peso actual</p>
              <p className="font-medium">{usuario.progreso.peso || 'No registrado'} {usuario.progreso.peso ? 'kg' : ''}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Ruler className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Medidas</p>
              <p className="font-medium">{usuario.progreso.medidas || 'No registradas'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Entrenamientos</h3>
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{usuario.progreso.entrenamientos.length}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Calorías quemadas</p>
              <p className="font-medium">{totalCalorias}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Minutos totales</p>
              <p className="font-medium">{totalDuracion}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Alimentación</h3>
            <Utensils className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Comidas registradas</p>
              <p className="font-medium">{usuario.progreso.dietas.length}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Calorías consumidas</p>
              <p className="font-medium">{totalCaloriasConsumidas}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Balance calórico</p>
              <p className={`font-medium ${totalCaloriasConsumidas - totalCalorias > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {totalCaloriasConsumidas - totalCalorias}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Resumen</h3>
            <div className="h-5 w-5 text-green-600">📊</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Último entrenamiento</p>
              <p className="font-medium">
                {usuario.progreso.entrenamientos.length > 0
                  ? formatDate(usuario.progreso.entrenamientos[usuario.progreso.entrenamientos.length - 1].fecha)
                  : 'Ninguno'}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Última comida</p>
              <p className="font-medium">
                {usuario.progreso.dietas.length > 0
                  ? formatDate(usuario.progreso.dietas[usuario.progreso.dietas.length - 1].fecha)
                  : 'Ninguna'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Últimos Entrenamientos</h3>
          {usuario.progreso.entrenamientos.length > 0 ? (
            <div className="space-y-4">
              {[...usuario.progreso.entrenamientos]
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .slice(0, 3)
                .map((entrenamiento: Entrenamiento, index: number) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <p className="text-sm text-gray-500">{formatDate(entrenamiento.fecha)}</p>
                    <p className="font-medium">{entrenamiento.detalle}</p>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>{entrenamiento.duracion} min</span>
                      <span>{entrenamiento.calorias} calorías</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay entrenamientos registrados</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Últimas Comidas</h3>
          {usuario.progreso.dietas.length > 0 ? (
            <div className="space-y-4">
              {[...usuario.progreso.dietas]
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .slice(0, 3)
                .map((dieta: Dieta, index: number) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <p className="text-sm text-gray-500">{formatDate(dieta.fecha)}</p>
                    <p className="font-medium">{dieta.descripcion}</p>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>{dieta.calorias} cal</span>
                      <span>P: {dieta.proteinas}g | C: {dieta.carbohidratos}g | G: {dieta.grasas}g</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay comidas registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;