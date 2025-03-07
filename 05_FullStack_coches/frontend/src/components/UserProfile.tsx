import React from 'react';
import { Usuario } from '../types';
import { User, GamepadIcon, X } from 'lucide-react';
import { eliminarJuegoUsuario } from '../api';

interface UserProfileProps {
  usuario: Usuario;
  onUserUpdated: (usuario: Usuario) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ usuario, onUserUpdated, onLogout }) => {
  // Contar las etiquetas más frecuentes
  const tagCounts: Record<string, number> = {};
  usuario.juegos.forEach(juego => {
    juego.etiquetas.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Ordenar las etiquetas por frecuencia
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 etiquetas

  // Eliminar juego de la biblioteca del usuario
  const handleRemoveGame = async (juegoId: string) => {
    try {
      const updatedUser = await eliminarJuegoUsuario(usuario._id, juegoId);
      onUserUpdated(updatedUser);
    } catch (error) {
      console.error('Error al eliminar juego:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-purple-600 p-3 rounded-full mr-4">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{usuario.nombre}</h2>
            <p className="text-gray-400">{usuario.juegos.length} juegos en biblioteca</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>

      {sortedTags.length > 0 && (
        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Tus géneros favoritos</h3>
          <div className="flex flex-wrap gap-2">
            {sortedTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center bg-gray-600 px-3 py-1 rounded-full">
                <span className="text-white font-medium">{tag}</span>
                <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-4">Tu biblioteca de juegos</h3>
      
      {usuario.juegos.length === 0 ? (
        <div className="bg-gray-700 p-6 rounded-lg text-center">
          <GamepadIcon size={48} className="text-gray-500 mx-auto mb-3" />
          <p className="text-gray-300">No tienes juegos en tu biblioteca.</p>
          <p className="text-gray-400 text-sm mt-2">Explora el catálogo y añade tus juegos favoritos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usuario.juegos.map(juego => (
            <div key={juego._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="text-white font-medium">{juego.titulo}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {juego.etiquetas.map((tag, idx) => (
                    <span key={idx} className="text-xs text-gray-300 bg-gray-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => juego._id && handleRemoveGame(juego._id)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Eliminar juego"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;