import axios from 'axios';
import type { User, Pet, Clinic } from '../types';
import { mockUsers, mockPets, mockClinics } from './mockData';

const API_URL = 'http://localhost:3000';

// Toggle between mock and real API
const USE_MOCK = true;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock implementations
const mockApi = {
  createUser: async (data: User): Promise<User> => {
    const newUser = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockUsers.push(newUser);
    return newUser;
  },

  deleteUser: async (id: string): Promise<void> => {
    const index = mockUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  },

  createPet: async (data: Pet): Promise<Pet> => {
    const newPet = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockPets.push(newPet);
    return newPet;
  },

  getPets: async (userId: string): Promise<Pet[]> => {
    return mockPets.filter(pet => pet.propietarioId === userId);
  },

  deletePet: async (id: string): Promise<void> => {
    const index = mockPets.findIndex(pet => pet.id === id);
    if (index !== -1) {
      mockPets.splice(index, 1);
    }
  },

  getClinics: async (): Promise<Clinic[]> => {
    return mockClinics;
  }
};

// Real API implementations
const realApi = {
  createUser: async (data: User) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/usuarios/${id}`);
  },

  createPet: async (data: Pet) => {
    const response = await api.post('/mascotas', data);
    return response.data;
  },

  getPets: async (userId: string) => {
    const response = await api.get(`/mascotas?propietarioId=${userId}`);
    return response.data;
  },

  deletePet: async (id: string) => {
    await api.delete(`/mascotas/${id}`);
  },

  getClinics: async () => {
    const response = await api.get('/clinicas');
    return response.data;
  }
};

// Export the appropriate implementation based on USE_MOCK
export const {
  createUser,
  deleteUser,
  createPet,
  getPets,
  deletePet,
  getClinics
} = USE_MOCK ? mockApi : realApi;