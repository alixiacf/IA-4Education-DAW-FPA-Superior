import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../types';
import { createUser } from '../services/api';
import { UserIcon, Mail, Phone } from 'lucide-react';

interface UserFormProps {
  onSuccess: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<User>();

  const onSubmit = async (data: User) => {
    try {
      await createUser(data);
      reset();
      alert('Usuario creado exitosamente');
      onSuccess();
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('nombre', { required: 'Nombre es requerido' })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Juan"
          />
        </div>
        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Apellidos</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('apellidos', { required: 'Apellidos son requeridos' })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Pérez"
          />
        </div>
        {errors.apellidos && <p className="mt-1 text-sm text-red-600">{errors.apellidos.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('contacto.telefono', { required: 'Teléfono es requerido' })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="+34 600 000 000"
          />
        </div>
        {errors.contacto?.telefono && (
          <p className="mt-1 text-sm text-red-600">{errors.contacto.telefono.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('contacto.email', {
              required: 'Email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="juan@ejemplo.com"
          />
        </div>
        {errors.contacto?.email && (
          <p className="mt-1 text-sm text-red-600">{errors.contacto.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Crear Usuario
      </button>
    </form>
  );
}