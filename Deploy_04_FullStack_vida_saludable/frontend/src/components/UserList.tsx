import React from 'react';
import { Usuario } from '../types';
import { Edit, Trash2, User } from 'lucide-react';

interface UserListProps {
  usuarios: Usuario[];
  onSelectUser: (usuario: Usuario) => void;
  onEditUser: (usuario: Usuario) => void;
  onDeleteUser: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  usuarios, 
  onSelectUser, 
  onEditUser, 
  onDeleteUser 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Usuarios</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Selecciona un usuario para ver su progreso
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <li key={usuario._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 rounded-full bg-green-100 p-1 text-green-600" />
                    </div>
                    <div className="ml-4 cursor-pointer" onClick={() => onSelectUser(usuario)}>
                      <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                      <div className="text-sm text-gray-500">{usuario.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditUser(usuario)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(usuario._id)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No hay usuarios registrados
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserList;