import React, { useState } from 'react';
import { UsuarioInput } from '../types';

interface UserFormProps {
  onSubmit: (usuario: UsuarioInput) => void;
  initialData?: Partial<UsuarioInput>;
  buttonText?: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  initialData = {
    nombre: '',
    email: '',
    progreso: {
      peso: undefined,
      medidas: '',
      entrenamientos: [],
      dietas: []
    }
  },
  buttonText = 'Guardar'
}) => {
  const [formData, setFormData] = useState<UsuarioInput>({
    nombre: initialData.nombre || '',
    email: initialData.email || '',
    progreso: {
      peso: initialData.progreso?.peso,
      medidas: initialData.progreso?.medidas || '',
      entrenamientos: initialData.progreso?.entrenamientos || [],
      dietas: initialData.progreso?.dietas || []
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'peso') {
      setFormData({
        ...formData,
        progreso: {
          ...formData.progreso,
          peso: value ? Number(value) : undefined
        }
      });
    } else if (name === 'medidas') {
      setFormData({
        ...formData,
        progreso: {
          ...formData.progreso,
          medidas: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>
      
      <div>
        <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
          Peso (kg)
        </label>
        <input
          type="number"
          id="peso"
          name="peso"
          value={formData.progreso.peso || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>
      
      <div>
        <label htmlFor="medidas" className="block text-sm font-medium text-gray-700">
          Medidas
        </label>
        <input
          type="text"
          id="medidas"
          name="medidas"
          value={formData.progreso.medidas}
          onChange={handleChange}
          placeholder="Ej: Pecho: 95cm, Cintura: 80cm"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>
      
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default UserForm;