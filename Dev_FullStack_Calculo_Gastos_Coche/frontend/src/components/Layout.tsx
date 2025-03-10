import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Car, CalculatorIcon, Home } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 text-gray-900 hover:text-blue-600">
                <Home className="w-5 h-5 mr-2" />
                <span className="font-semibold">Inicio</span>
              </Link>
              <Link to="/calculator" className="flex items-center px-4 text-gray-900 hover:text-blue-600">
                <CalculatorIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Calculadora</span>
              </Link>
              <Link to="/cars" className="flex items-center px-4 text-gray-900 hover:text-blue-600">
                <Car className="w-5 h-5 mr-2" />
                <span className="font-semibold">Coches</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/trips/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Nuevo Viaje
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}