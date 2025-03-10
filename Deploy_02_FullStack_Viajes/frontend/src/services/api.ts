import type { User, Place } from '../types';

const API_URL = '/api';

// Usuario "Ver todos" para mantener la funcionalidad de ver todas las marcas
const ALL_USERS: User = {
  _id: "all-users",
  name: "Ver todos",
  email: "all@example.com",
  avatar: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=100",
  createdAt: new Date().toISOString()
};

export const api = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching users');
      }
      const users = await response.json();
      return [ALL_USERS, ...users];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error al obtener usuarios');
    }
  },

  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creating user');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error al crear usuario');
    }
  },

  async getUserPlaces(userId: string): Promise<Place[]> {
    try {
      // Si es "all-users", obtener todos los lugares usando la ruta correcta
      const endpoint = userId === "all-users" 
        ? `${API_URL}/places` // Cambiado de /places/all a /places
        : `${API_URL}/places/user/${userId}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching places');
      }
      const data = await response.json();
      
      // Si es "all-users", asegurarse de que los datos incluyan la información del usuario
      if (userId === "all-users") {
        return data.map((place: any) => ({
          ...place,
          userName: place.userId?.name || 'Usuario Desconocido',
          userAvatar: place.userId?.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100',
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching places:', error);
      throw new Error('Error al obtener lugares');
    }
  },

  async createPlace(placeData: Omit<Place, '_id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Place> {
    try {
      const response = await fetch(`${API_URL}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creating place');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating place:', error);
      throw new Error('Error al crear lugar');
    }
  }
};