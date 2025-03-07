import React, { useState } from 'react';
import { Juego, Usuario } from '../types';
import GameCard from './GameCard';
import TagFilter from './TagFilter';
import { Search } from 'lucide-react';
import { agregarJuegoUsuario } from '../api';

interface GameListProps {
  juegos: Juego[];
  usuario: Usuario | null;
  onUserUpdated: (usuario: Usuario) => void;
  title?: string;
}

const GameList: React.FC<GameListProps> = ({ 
  juegos, 
  usuario, 
  onUserUpdated,
  title = "Catálogo de Juegos" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extraer todas las etiquetas únicas de los juegos
  const allTags = Array.from(new Set(juegos.flatMap(juego => juego.etiquetas)));

  // Filtrar juegos por búsqueda y etiquetas seleccionadas
  const filteredGames = juegos.filter(juego => {
    const matchesSearch = juego.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         juego.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => juego.etiquetas.includes(tag));
    
    return matchesSearch && matchesTags;
  });

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

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      
      <div className="mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <TagFilter 
          allTags={allTags} 
          selectedTags={selectedTags} 
          onTagSelect={(tag) => {
            setSelectedTags(prev => 
              prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
            );
          }} 
        />
      </div>
      
      {filteredGames.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No se encontraron juegos con los criterios seleccionados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(juego => (
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

export default GameList;