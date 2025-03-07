import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';

export default function UserRegistration() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registro de Usuario
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Completa el formulario para crear tu cuenta
          </p>
        </div>
        <div className="mt-8">
          <UserForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}