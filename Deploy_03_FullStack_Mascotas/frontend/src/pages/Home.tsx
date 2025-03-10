import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, UserPlus, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Bienvenido a <span className="text-indigo-600">VetCare</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Gestiona tus mascotas y encuentra las mejores clínicas veterinarias cerca de ti.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/registro"
            className="relative group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-indigo-600" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">Registro de Usuario</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Crea tu cuenta para empezar a gestionar tus mascotas.
            </p>
          </Link>

          <Link
            to="/mascotas"
            className="relative group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-indigo-600" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">Gestión de Mascotas</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Administra la información de tus mascotas de forma fácil y segura.
            </p>
          </Link>

          <Link
            to="/clinicas"
            className="relative group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-indigo-600" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">Clínicas Veterinarias</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Encuentra las clínicas veterinarias más cercanas a tu ubicación.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}