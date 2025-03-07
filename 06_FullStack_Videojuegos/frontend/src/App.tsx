import React, { useState, useEffect } from 'react';
import { Usuario, Juego } from './types';
import { getUsuarios, getJuegos, getRecomendacionesGenerales, getRecomendacionesPersonalizadas } from './api';
import UserForm from './components/UserForm';
import UserProfile from './components/UserProfile';
import GameList from './components/GameList';
import RecommendationList from './components/RecommendationList';
import { GamepadIcon } from 'lucide-react';

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<Juego[]>([]);
  const [recomendacionesPersonalizadas, setRecomendacionesPersonalizadas] = useState<Juego[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recomendaciones' | 'catalogo' | 'perfil'>('recomendaciones');
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar usuarios y juegos
        const [usuariosData, juegosData] = await Promise.all([
          getUsuarios(),
          getJuegos()
        ]);
        
        setUsuarios(usuariosData);
        setJuegos(juegosData);
        
        // Cargar recomendaciones generales
        try {
          const recomendacionesData = await getRecomendacionesGenerales();
          setRecomendaciones(Array.isArray(recomendacionesData) ? recomendacionesData : []);
        } catch (recError) {
          console.error('Error al cargar recomendaciones generales:', recError);
          setRecomendaciones([]);
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setError('Error al conectar con el servidor. Por favor, verifica que el backend esté en ejecución.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Cargar recomendaciones personalizadas cuando se selecciona un usuario
  useEffect(() => {
    if (usuarioActual) {
      const fetchPersonalizedRecommendations = async () => {
        try {
          const data = await getRecomendacionesPersonalizadas(usuarioActual._id);
          setRecomendacionesPersonalizadas(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error al cargar recomendaciones personalizadas:', error);
          setRecomendacionesPersonalizadas([]);
        }
      };

      fetchPersonalizedRecommendations();
    }
  }, [usuarioActual]);

  // Manejar la selección de usuario
  const handleUserSelect = async (userId: string) => {
    try {
      // Buscar el usuario en la lista actual
      let usuario = usuarios.find(u => u._id === userId);
      
      // Si no se encuentra, actualizar la lista de usuarios y buscar de nuevo
      if (!usuario) {
        const updatedUsers = await getUsuarios();
        setUsuarios(updatedUsers);
        usuario = updatedUsers.find(u => u._id === userId);
      }
      
      if (usuario) {
        setUsuarioActual(usuario);
        setActiveTab('recomendaciones');
      }
    } catch (error) {
      console.error('Error al seleccionar usuario:', error);
    }
  };

  // Manejar la actualización de usuario
  const handleUserUpdated = (updatedUser: Usuario) => {
    setUsuarioActual(updatedUser);
    setUsuarios(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
    
    // Actualizar recomendaciones personalizadas
    getRecomendacionesPersonalizadas(updatedUser._id)
      .then(data => setRecomendacionesPersonalizadas(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error('Error al actualizar recomendaciones:', error);
        setRecomendacionesPersonalizadas([]);
      });
  };

  // Manejar el cierre de sesión
  const handleLogout = () => {
    setUsuarioActual(null);
    setActiveTab('recomendaciones');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <GamepadIcon size={48} className="text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <GamepadIcon size={32} className="text-purple-500 mr-3" />
              <h1 className="text-2xl font-bold">GameRecommender</h1>
            </div>
            
            {!usuarioActual ? (
              <div className="w-full md:w-auto">
                {usuarios.length > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                      className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => handleUserSelect(e.target.value)}
                      value=""
                    >
                      <option value="" disabled>Seleccionar usuario</option>
                      {usuarios.map(usuario => (
                        <option key={usuario._id} value={usuario._id}>
                          {usuario.nombre}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-400 self-center">o</span>
                    <button 
                      onClick={() => setUsuarioActual(null)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition duration-300"
                    >
                      Crear nuevo usuario
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400">Crea un usuario para comenzar</p>
                )}
              </div>
            ) : (
              <nav className="flex space-x-1 sm:space-x-4">
                <button 
                  onClick={() => setActiveTab('recomendaciones')}
                  className={`px-3 py-2 rounded-md transition duration-300 ${
                    activeTab === 'recomendaciones' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Recomendaciones
                </button>
                <button 
                  onClick={() => setActiveTab('catalogo')}
                  className={`px-3 py-2 rounded-md transition duration-300 ${
                    activeTab === 'catalogo' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Catálogo
                </button>
                <button 
                  onClick={() => setActiveTab('perfil')}
                  className={`px-3 py-2 rounded-md transition duration-300 ${
                    activeTab === 'perfil' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Mi Perfil
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {!usuarioActual ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <UserForm onUserCreated={handleUserSelect} />
            </div>
            <div className="lg:col-span-2">
              <RecommendationList 
                recomendaciones={recomendaciones} 
                usuario={null}
                onUserUpdated={handleUserUpdated}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === 'recomendaciones' && (
              <RecommendationList 
                recomendaciones={recomendacionesPersonalizadas} 
                usuario={usuarioActual}
                onUserUpdated={handleUserUpdated}
                isPersonalized={true}
              />
            )}
            
            {activeTab === 'catalogo' && (
              <GameList 
                juegos={juegos} 
                usuario={usuarioActual}
                onUserUpdated={handleUserUpdated}
              />
            )}
            
            {activeTab === 'perfil' && (
              <UserProfile 
                usuario={usuarioActual} 
                onUserUpdated={handleUserUpdated}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>GameRecommender &copy; 2025 - Tu plataforma de recomendación de videojuegos</p>
        </div>
      </footer>
    </div>
  );
}

export default App;