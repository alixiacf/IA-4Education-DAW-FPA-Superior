import axios from 'axios';
import type { User, Pet, Clinic } from '../types';

// Cuando se accede desde el navegador, usar localhost
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : (import.meta.env.VITE_API_URL || 'http://backend:3000');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const createUser = async (data: User) => {
  const response = await api.post('/usuarios', data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/usuarios/${id}`);
};

export const createPet = async (data: Pet) => {
  const response = await api.post('/mascotas', data);
  return response.data;
};

export const getPets = async (userId: string) => {
  const response = await api.get(`/mascotas?propietarioId=${userId}`);
  return response.data;
};

export const deletePet = async (id: string) => {
  await api.delete(`/mascotas/${id}`);
};

export const getClinics = async () => {
  const response = await api.get('/clinicas');
  return response.data;
};