import React, { useState } from 'react';
import { DietaInput } from '../types';

interface DietFormProps {
  onSubmit: (dieta: DietaInput) => void;
}

const DietForm: React.FC<DietFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DietaInput>({
    descripcion: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'descripcion' ? value : Number(value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      descripcion: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción de la comida
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          placeholder="Describe tu comida"
        />
      </div>
      
      <div>
        <label htmlFor="calorias" className="block text-sm font-medium text-gray-700">
          Calorías
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
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="proteinas" className="block text-sm font-medium text-gray-700">
            Proteínas (g)
          </label>
          <input
            type="number"
            id="proteinas"
            name="proteinas"
            value={formData.proteinas}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
        </div>
        
        <div>
          <label htmlFor="carbohidratos" className="block text-sm font-medium text-gray-700">
            Carbohidratos (g)
          </label>
          <input
            type="number"
            id="carbohidratos"
            name="carbohidratos"
            value={formData.carbohidratos}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
        </div>
        
        <div>
          <label htmlFor="grasas" className="block text-sm font-medium text-gray-700">
            Grasas (g)
          </label>
          <input
            type="number"
            id="grasas"
            name="grasas"
            value={formData.grasas}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Registrar Comida
        </button>
      </div>
    </form>
  );
};

export default DietForm;