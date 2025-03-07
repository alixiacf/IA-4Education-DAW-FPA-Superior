import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import UserForm from './components/UserForm';
import WorkoutForm from './components/WorkoutForm';
import DietForm from './components/DietForm';
import ProgressDashboard from './components/ProgressDashboard';
import HealthAdvice from './components/HealthAdvice';
import UserList from './components/UserList';
import { Usuario, UsuarioInput, EntrenamientoInput, DietaInput } from './types';
import { 
  fetchUsuarios, 
  fetchUsuario, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
  agregarEntrenamiento,
  agregarDieta
} from './api';
import { PlusCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  // Cargar usuarios al iniciar
  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsuarios();
        setUsuarios(data);
        
        // Si hay usuarios, seleccionar el primero por defecto
        if (data.length > 0) {
          const usuario = await fetchUsuario(data[0]._id);
          setUsuarioActual(usuario);
        }
        
        setError(null);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsuarios();
  }, []);

  // Manejar la creación de un nuevo usuario
  const handleCreateUser = async (userData: UsuarioInput) => {
    try {
      setIsLoading(true);
      const newUser = await crearUsuario(userData);
      setUsuarios([...usuarios, newUser]);
      setUsuarioActual(newUser);
      setShowUserForm(false);
      setActiveTab('dashboard');
    } catch (err) {
      setError('Error al crear el usuario');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la actualización de un usuario
  const handleUpdateUser = async (userData: UsuarioInput) => {
    if (!editingUser) return;
    
    try {
      setIsLoading(true);
      const updatedUser = await actualizarUsuario(editingUser._id, userData);
      
      setUsuarios(usuarios.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      ));
      
      if (usuarioActual && usuarioActual._id === updatedUser._id) {
        setUsuarioActual(updatedUser);
      }
      
      setEditingUser(null);
      setShowUserForm(false);
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la eliminación de un usuario
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await eliminarUsuario(id);
      
      const updatedUsers = usuarios.filter(u => u._id !== id);
      setUsuarios(updatedUsers);
      
      if (usuarioActual && usuarioActual._id === id) {
        setUsuarioActual(updatedUsers.length > 0 ? updatedUsers[0] : null);
      }
    } catch (err) {
      setError('Error al eliminar el usuario');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la selección de un usuario
  const handleSelectUser = async (usuario: Usuario) => {
    try {
      setIsLoading(true);
      const detailedUser = await fetchUsuario(usuario._id);
      setUsuarioActual(detailedUser);
      setActiveTab('dashboard');
    } catch (err) {
      setError('Error al cargar los detalles del usuario');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la edición de un usuario
  const handleEditUser = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  // Manejar el registro de un entrenamiento
  const handleAddWorkout = async (entrenamiento: EntrenamientoInput) => {
    if (!usuarioActual) return;
    
    try {
      setIsLoading(true);
      const updatedUser = await agregarEntrenamiento(usuarioActual._id, entrenamiento);
      
      setUsuarioActual(updatedUser);
      setUsuarios(usuarios.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      ));
      
      setActiveTab('dashboard');
    } catch (err) {
      setError('Error al registrar el entrenamiento');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el registro de una dieta
  const handleAddDiet = async (dieta: DietaInput) => {
    if (!usuarioActual) return;
    
    try {
      setIsLoading(true);
      const updatedUser = await agregarDieta(usuarioActual._id, dieta);
      
      setUsuarioActual(updatedUser);
      setUsuarios(usuarios.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      ));
      
      setActiveTab('dashboard');
    } catch (err) {
      setError('Error al registrar la dieta');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Por favor, intenta de nuevo más tarde o contacta con soporte.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return usuarioActual ? (
          <div className="space-y-6">
            <ProgressDashboard usuario={usuarioActual} />
            <HealthAdvice />
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo usuario.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('usuarios');
                  setShowUserForm(true);
                  setEditingUser(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nuevo Usuario
              </button>
            </div>
          </div>
        );
        
      case 'usuarios':
        return showUserForm ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <UserForm 
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              initialData={editingUser || undefined}
              buttonText={editingUser ? 'Actualizar' : 'Crear'}
            />
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => {
                  setShowUserForm(false);
                  setEditingUser(null);
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowUserForm(true);
                  setEditingUser(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nuevo Usuario
              </button>
            </div>
            
            <UserList 
              usuarios={usuarios}
              onSelectUser={handleSelectUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        );
        
      case 'entrenamiento':
        return usuarioActual ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Registrar Entrenamiento</h2>
            <WorkoutForm onSubmit={handleAddWorkout} />
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuario seleccionado</h3>
            <p className="mt-1 text-sm text-gray-500">Selecciona o crea un usuario primero.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('usuarios')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Ir a Usuarios
              </button>
            </div>
          </div>
        );
        
      case 'alimentacion':
        return usuarioActual ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Registrar Alimentación</h2>
            <DietForm onSubmit={handleAddDiet} />
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuario seleccionado</h3>
            <p className="mt-1 text-sm text-gray-500">Selecciona o crea un usuario primero.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('usuarios')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Ir a Usuarios
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onChangeTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;