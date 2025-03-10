import type { User, Place } from '../types';

// Usuarios de prueba
const testUsers: User[] = [
  {
    _id: "all-users",
    name: "Ver todos",
    email: "all@example.com",
    avatar: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=100",
    createdAt: new Date().toISOString()
  },
  {
    _id: "test-user-1",
    name: "Usuario de Prueba",
    email: "test@example.com",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    createdAt: new Date().toISOString()
  },
  {
    _id: "test-user-2",
    name: "María García",
    email: "maria@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    createdAt: new Date().toISOString()
  }
];

// Lugares de prueba
const testPlaces: Place[] = [
  {
    _id: "place-1",
    userId: "test-user-1",
    userName: "Usuario de Prueba",
    userAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    location: { lat: 40.4167, lng: -3.7033 },
    type: "visited",
    review: "Madrid es una ciudad increíble",
    experienceTemp: 9,
    createdAt: new Date().toISOString()
  },
  {
    _id: "place-2",
    userId: "test-user-1",
    userName: "Usuario de Prueba",
    userAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
    location: { lat: 41.3851, lng: 2.1734 },
    type: "desired",
    review: "Me gustaría visitar Barcelona pronto",
    experienceTemp: 8,
    createdAt: new Date().toISOString()
  },
  {
    _id: "place-3",
    userId: "test-user-2",
    userName: "María García",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    location: { lat: 36.7213, lng: -4.4214 },
    type: "visited",
    review: "Málaga tiene las mejores playas",
    experienceTemp: 10,
    createdAt: new Date().toISOString()
  },
  {
    _id: "place-4",
    userId: "test-user-2",
    userName: "María García",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    location: { lat: 37.3891, lng: -5.9845 },
    type: "desired",
    review: "Sevilla está en mi lista de deseos",
    experienceTemp: 9,
    createdAt: new Date().toISOString()
  }
];

// Simulación de la API
export const mockApi = {
  async getUsers(): Promise<User[]> {
    return testUsers;
  },

  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    return {
      ...userData,
      _id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  async getUserPlaces(userId: string): Promise<Place[]> {
    if (userId === "all-users") {
      return testPlaces;
    }
    return testPlaces.filter(place => place.userId === userId);
  },

  async createPlace(placeData: Omit<Place, '_id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Place> {
    const user = testUsers.find(u => u._id === placeData.userId);
    return {
      ...placeData,
      _id: `place-${Date.now()}`,
      userName: user?.name || '',
      userAvatar: user?.avatar || '',
      createdAt: new Date().toISOString()
    };
  }
};