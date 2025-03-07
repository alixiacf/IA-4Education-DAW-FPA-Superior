import React, { useState, useEffect } from 'react';
import { MapPin, Heart } from 'lucide-react';
import Map from './components/Map';
import PlaceForm from './components/PlaceForm';
import UserSelect from './components/UserSelect';
import { mockApi } from './services/mockApi';
import type { Place, Location, User } from './types';

function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<'visited' | 'desired'>('visited');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showUserSelect, setShowUserSelect] = useState(true);

  useEffect(() => {
    if (currentUser?._id) {
      mockApi.getUserPlaces(currentUser._id)
        .then(setPlaces)
        .catch(console.error);
    }
  }, [currentUser]);

  const handleLocationSelect = (location: Location) => {
    if (!currentUser) {
      alert('Por favor, selecciona un usuario primero');
      setShowUserSelect(true);
      return;
    }
    setSelectedLocation(location);
  };

  const handlePlaceSubmit = async (data: { review: string; experienceTemp: number }) => {
    if (!currentUser || !selectedLocation) return;

    try {
      const savedPlace = await mockApi.createPlace({
        userId: currentUser._id,
        location: selectedLocation,
        type: selectedType,
        review: data.review,
        experienceTemp: data.experienceTemp
      });
      
      setPlaces(prev => [...prev, savedPlace]);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el lugar');
    }
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    setShowUserSelect(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Mapa de Viajes</h1>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{currentUser.name}</span>
                <button
                  onClick={() => setShowUserSelect(true)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowUserSelect(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Seleccionar Usuario
              </button>
            )}
            
            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('visited')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  selectedType === 'visited' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Visitado
              </button>
              <button
                onClick={() => setSelectedType('desired')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  selectedType === 'desired' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className="w-4 h-4" />
                Deseado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative z-0">
        <Map
          places={places}
          onLocationSelect={handleLocationSelect}
          selectedType={selectedType}
        />
      </div>

      {/* Modals */}
      {showUserSelect && (
        <UserSelect onUserSelect={handleUserSelect} />
      )}

      {selectedLocation && (
        <PlaceForm
          location={selectedLocation}
          type={selectedType}
          onSubmit={handlePlaceSubmit}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
}

export default App;