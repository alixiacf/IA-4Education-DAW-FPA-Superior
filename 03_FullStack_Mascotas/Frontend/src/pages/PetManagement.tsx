import React, { useState } from 'react';
import PetForm from '../components/PetForm';
import PetList from '../components/PetList';

export default function PetManagement() {
  const [userId, setUserId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const handleUserIdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Gestión de Mascotas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Administra la información de tus mascotas
          </p>
        </div>

        {!showForm ? (
          <div className="mt-8 max-w-md mx-auto">
            <form onSubmit={handleUserIdSubmit} className="space-y-6">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  ID de Usuario
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continuar
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Agregar Nueva Mascota
                </h3>
                <div className="mt-5">
                  <PetForm userId={userId} onSuccess={() => {}} />
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  Tus Mascotas
                </h3>
                <PetList userId={userId} onDelete={() => {}} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}