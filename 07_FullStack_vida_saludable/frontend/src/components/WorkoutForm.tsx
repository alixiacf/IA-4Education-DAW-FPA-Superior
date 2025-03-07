import React, { useState } from 'react';
import { EntrenamientoInput } from '../types';

interface WorkoutFormProps {
  onSubmit: (entrenamiento: EntrenamientoInput) => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EntrenamientoInput>({
    detalle: '',
    duracion: 0,
    calorias: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'detalle' ? value : Number(value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      detalle: '',
      duracion: 0,
      calorias: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="detalle" className="block text-sm font-medium text-gray-700">
          Detalle del entrenamiento
        </label>
        <textarea
          id="detalle"
          name="detalle"
          value={formData.detalle}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          placeholder="Describe tu entrenamiento"
        />
      </div>
      
      <div>
        <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
          Duración (minutos)
        </label>
        <input
          type="number"
          id="duracion"
          name="duracion"
          value={formData.duracion}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>
      
      <div>
        <label htmlFor="calorias" className="block text-sm font-medium text-gray-700">
          Calorías quemadas
        </label>
        <input
          type="number"
          id="calorias"
          name="calorias"
          value={formData.calorias}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>
      
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Registrar Entrenamiento
        </button>
      </div>
    </form>
  );
};

export default WorkoutForm;