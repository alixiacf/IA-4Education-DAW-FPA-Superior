import { Usuario, UsuarioInput, EntrenamientoInput, DietaInput } from '../types';

const API_URL = 'http://localhost:3000';

// Usuarios
export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const response = await fetch(`${API_URL}/usuarios`);
  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }
  return response.json();
};

export const fetchUsuario = async (id: string): Promise<Usuario> => {
  const response = await fetch(`${API_URL}/usuarios/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener usuario');
  }
  return response.json();
};

export const crearUsuario = async (usuario: UsuarioInput): Promise<Usuario> => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  if (!response.ok) {
    throw new Error('Error al crear usuario');
  }
  return response.json();
};

export const actualizarUsuario = async (id: string, usuario: Partial<UsuarioInput>): Promise<Usuario> => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  if (!response.ok) {
    throw new Error('Error al actualizar usuario');
  }
  return response.json();
};

export const eliminarUsuario = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Error al eliminar usuario');
  }
  return response.json();
};

// Entrenamientos
export const agregarEntrenamiento = async (userId: string, entrenamiento: EntrenamientoInput): Promise<Usuario> => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/entrenamientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entrenamiento)
  });
  if (!response.ok) {
    throw new Error('Error al agregar entrenamiento');
  }
  return response.json();
};

// Dietas
export const agregarDieta = async (userId: string, dieta: DietaInput): Promise<Usuario> => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/dietas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dieta)
  });
  if (!response.ok) {
    throw new Error('Error al agregar dieta');
  }
  return response.json();
};

// Consejos
export const obtenerConsejo = async (): Promise<{ consejo: string }> => {
  const response = await fetch(`${API_URL}/consejos`);
  if (!response.ok) {
    throw new Error('Error al obtener consejo');
  }
  return response.json();
};