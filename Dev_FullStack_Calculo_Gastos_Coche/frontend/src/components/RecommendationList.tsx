import React from 'react';
import { Juego, Usuario } from '../types';
import GameCard from './GameCard';
import { Sparkles } from 'lucide-react';
import { agregarJuegoUsuario } from '../api';

interface RecommendationListProps {
  recomendaciones: Juego[];
  usuario: Usuario | null;
  onUserUpdated: (usuario: Usuario) => void;
  isPersonalized?: boolean;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recomendaciones, 
  usuario, 
  onUserUpdated,
  isPersonalized = false
}) => {
  // Verificar si un juego está en la biblioteca del usuario
  const isGameInUserLibrary = (gameTitle: string) => {
    return usuario?.juegos.some(juego => juego.titulo === gameTitle) || false;
  };

  // Añadir juego a la biblioteca del usuario
  const handleAddGame = async (juego: Juego) => {
    if (!usuario) return;
    
    try {
      const updatedUser = await agregarJuegoUsuario(usuario._id, {
        titulo: juego.titulo,
        etiquetas: juego.etiquetas
      });
      onUserUpdated(updatedUser);
    } catch (error) {
      console.error('Error al añadir juego:', error);
    }
  };

  // Asegurarse de que recomendaciones sea un array
  const recommendationsArray = Array.isArray(recomendaciones) ? recomendaciones : [];

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Sparkles size={24} className="text-yellow-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">
          {isPersonalized 
            ? `Recomendaciones para ${usuario?.nombre || 'ti'}`
            : 'Recomendaciones destacadas'}
        </h2>
      </div>
      
      {recommendationsArray.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-300 mb-2">No hay recomendaciones disponibles.</p>
          {isPersonalized && (
            <p className="text-gray-400 text-sm">
              Añade más juegos a tu biblioteca para obtener recomendaciones personalizadas.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendationsArray.map(juego => (
            <GameCard
              key={juego._id}
              juego={juego}
              isInUserLibrary={isGameInUserLibrary(juego.titulo)}
              onAddGame={() => handleAddGame(juego)}
              showActions={!!usuario}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationList;