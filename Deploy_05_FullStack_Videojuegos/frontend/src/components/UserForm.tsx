import React, { useState } from 'react';
import { crearUsuario, getUsuario } from '../api';

interface UserFormProps {
  onUserCreated: (userId: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa un nombre');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const usuario = await crearUsuario(nombre);
      setNombre('');
      
      // Asegurarse de que el usuario se ha creado correctamente
      if (usuario && usuario._id) {
        // Obtener el usuario recién creado para asegurarse de que está actualizado
        const confirmedUser = await getUsuario(usuario._id);
        onUserCreated(confirmedUser._id);
      } else {
        throw new Error('No se pudo crear el usuario correctamente');
      }
    } catch (err) {
      setError('Error al crear el usuario. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Crear Nuevo Usuario</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ingresa tu nombre"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;