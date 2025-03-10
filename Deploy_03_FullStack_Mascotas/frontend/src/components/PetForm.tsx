import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Pet, Vaccine } from '../types';
import { createPet } from '../services/api';
import { PawPrint, Image, Plus, Trash2, Syringe } from 'lucide-react';

interface PetFormProps {
  userId: string;
  onSuccess: () => void;
}

export default function PetForm({ userId, onSuccess }: PetFormProps) {
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<Pet>({
    defaultValues: {
      vacunas: [{ tipo: '', fechaProxima: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vacunas"
  });

  const onSubmit = async (data: Pet) => {
    try {
      // Convierte edad a número
      const edad = Number(data.edad);

      // Asegurémonos de que todas las vacunas tienen fechas válidas
      const formattedData = {
        ...data,
        edad, // Envía edad como número
        propietarioId: userId, // Este debería ser un ObjectId válido ahora
        vacunas: data.vacunas.filter(vacuna => vacuna.tipo && vacuna.fechaProxima)
      };
      
      console.log("Enviando datos de mascota:", formattedData);
      console.log("ID del propietario:", userId);
      
      await createPet(formattedData);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error al crear mascota:", error);
      alert('Error al crear mascota: ' + (error as any).response?.data?.message || 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PawPrint className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('nombre', { required: 'Nombre es requerido' })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Firulais"
          />
        </div>
        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Edad</label>
        <input
          type="number"
          {...register('edad', { required: 'Edad es requerida', min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.edad && <p className="mt-1 text-sm text-red-600">{errors.edad.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Raza</label>
        <input
          {...register('raza', { required: 'Raza es requerida' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Labrador"
        />
        {errors.raza && <p className="mt-1 text-sm text-red-600">{errors.raza.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          {...register('tipo', { required: 'Tipo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Seleccione un tipo</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="ave">Ave</option>
          <option value="otro">Otro</option>
        </select>
        {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL de la foto</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Image className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('foto', { required: 'URL de la foto es requerida' })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://ejemplo.com/foto.jpg"
          />
        </div>
        {errors.foto && <p className="mt-1 text-sm text-red-600">{errors.foto.message}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Vacunas Próximas</label>
          <button
            type="button"
            onClick={() => append({ tipo: '', fechaProxima: '' })}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Vacuna
          </button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Syringe className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Vacuna {index + 1}</span>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Vacuna</label>
              <input
                {...register(`vacunas.${index}.tipo` as const, { required: 'Tipo de vacuna es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Rabia, Parvovirus, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha Próxima</label>
              <input
                type="date"
                {...register(`vacunas.${index}.fechaProxima` as const, { required: 'Fecha próxima es requerida' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Agregar Mascota
      </button>
    </form>
  );
}