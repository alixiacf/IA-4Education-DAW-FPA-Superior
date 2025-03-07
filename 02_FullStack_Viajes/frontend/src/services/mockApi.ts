import type { User, Place } from '../types';

// Usuario de prueba
const testUser: User = {
  _id: "test-user-1",
  name: "Usuario de Prueba",
  email: "test@example.com",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
  createdAt: new Date().toISOString()
};

// Lugares de prueba
const testPlaces: Place[] = [
  {
    _id: "place-1",
    userId: testUser._id,
    location: { lat: 40.4167, lng: -3.7033 },
    type: "visited",
    review: "Madrid es una ciudad increíble",
    experienceTemp: 9,
    createdAt: new Date().toISOString()
  },
  {
    _id: "place-2",
    userId: testUser._id,
    location: { lat: 41.3851, lng: 2.1734 },
    type: "desired",
    review: "Me gustaría visitar Barcelona pronto",
    experienceTemp: 8,
    createdAt: new Date().toISOString()
  }
];

// Simulación de la API
export const mockApi = {
  async getUsers(): Promise<User[]> {
    return [testUser];
  },

  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    return {
      ...userData,
      _id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  async getUserPlaces(userId: string): Promise<Place[]> {
    return userId === testUser._id ? testPlaces : [];
  },

  async createPlace(placeData: Omit<Place, '_id' | 'createdAt'>): Promise<Place> {
    return {
      ...placeData,
      _id: `place-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  }
};