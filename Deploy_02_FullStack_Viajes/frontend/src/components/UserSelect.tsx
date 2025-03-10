import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface UserSelectProps {
  onUserSelect: (user: User) => void;
}

export default function UserSelect({ onUserSelect }: UserSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', avatar: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .catch(error => {
        console.error('Error:', error);
        setError('Error al cargar usuarios');
      });
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdUser = await api.createUser(newUser);
      setUsers(prev => [...prev, createdUser]);
      onUserSelect(createdUser);
      setIsCreating(false);
      setNewUser({ name: '', email: '', avatar: '' });
    } catch (error) {
      console.error('Error:', error);
      setError('Error al crear usuario');
    }
  };

  const handleUserClick = (user: User) => {
    onUserSelect(user);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {isCreating ? 'Crear Nuevo Usuario' : 'Seleccionar Usuario'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Cerrar</span>
              ×
            </button>
          </div>
        )}

        {isCreating ? (
          <form onSubmit={handleCreateUser}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={newUser.avatar}
                  onChange={e => setNewUser(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://ejemplo.com/avatar.jpg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Crear Usuario
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid gap-2 mb-4">
              {users.map(user => (
                <button
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Crear Nuevo Usuario
            </button>
          </div>
        )}
      </div>
    </div>
  );
}