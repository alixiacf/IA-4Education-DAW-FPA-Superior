import React, { useEffect, useState } from 'react';
import { Pet } from '../types';
import { getPets, deletePet } from '../services/api';
import { Trash2, Calendar, Syringe } from 'lucide-react';

interface PetListProps {
  userId: string;
  onDelete: () => void;
}

export default function PetList({ userId, onDelete }: PetListProps) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    loadPets();
  }, [userId]);

  const loadPets = async () => {
    try {
      const data = await getPets(userId);
      setPets(data);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePet(id);
      onDelete();
      loadPets();
    } catch (error) {
      alert('Error al eliminar mascota');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pets.map((pet) => (
        <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={pet.foto}
            alt={pet.nombre}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{pet.nombre}</h3>
            <p className="text-sm text-gray-500">{pet.raza}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">{pet.edad} años</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {pet.tipo}
              </span>
            </div>

            {pet.vacunas && pet.vacunas.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Syringe className="h-4 w-4 mr-1" />
                  Próximas Vacunas
                </h4>
                <div className="space-y-2">
                  {pet.vacunas.map((vacuna, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <p className="text-sm font-medium text-gray-800">{vacuna.tipo}</p>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(vacuna.fechaProxima)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => pet.id && handleDelete(pet.id)}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}