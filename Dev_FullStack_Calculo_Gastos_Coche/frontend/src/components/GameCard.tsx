import React from 'react';
import { Juego } from '../types';
import { Plus, Check, X } from 'lucide-react';

interface GameCardProps {
  juego: Juego;
  isInUserLibrary?: boolean;
  onAddGame?: () => void;
  onRemoveGame?: () => void;
  showActions?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  juego, 
  isInUserLibrary = false, 
  onAddGame, 
  onRemoveGame,
  showActions = true
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={juego.imagen} 
          alt={juego.titulo} 
          className="w-full h-full object-cover"
        />
        {isInUserLibrary && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Check size={12} className="mr-1" />
            En tu biblioteca
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{juego.titulo}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{juego.descripcion}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {juego.etiquetas.map((etiqueta, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs font-semibold rounded-full"
              style={{ 
                backgroundColor: getTagColor(etiqueta),
                color: ['RPG', 'Estrategia', 'Simulación'].includes(etiqueta) ? '#fff' : '#000'
              }}
            >
              {etiqueta}
            </span>
          ))}
        </div>
        {showActions && (
          <div className="flex justify-end">
            {!isInUserLibrary ? (
              <button 
                onClick={onAddGame} 
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition duration-300"
              >
                <Plus size={16} className="mr-1" />
                Añadir
              </button>
            ) : (
              <button 
                onClick={onRemoveGame} 
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition duration-300"
              >
                <X size={16} className="mr-1" />
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Función para asignar colores a las etiquetas
const getTagColor = (tag: string): string => {
  const tagColors: Record<string, string> = {
    'RPG': '#8b5cf6', // Púrpura
    'Acción': '#ef4444', // Rojo
    'Aventura': '#f59e0b', // Ámbar
    'Estrategia': '#0891b2', // Cian
    'Deportes': '#16a34a', // Verde
    'Simulación': '#1d4ed8', // Azul
    'Multijugador': '#db2777', // Rosa
    'Indie': '#6366f1', // Índigo
    'Mundo abierto': '#65a30d', // Lima
    'Shooter': '#b91c1c', // Rojo oscuro
  };

  return tagColors[tag] || '#6b7280'; // Gris por defecto
};

export default GameCard;