import { Usuario, Juego, JuegoInput } from '../types';

const API_URL = 'http://localhost:3000';

// Función de ayuda para manejar errores de red
const handleFetchError = (error: any, defaultValue: any = null) => {
  console.error('Error en la petición API:', error);
  return defaultValue;
};

// Usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error, []);
  }
};

export const getUsuario = async (id: string): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const crearUsuario = async (nombre: string): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, juegos: [] })
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const actualizarUsuario = async (id: string, usuario: Partial<Usuario>): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const eliminarUsuario = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Juegos de Usuario
export const agregarJuegoUsuario = async (userId: string, juego: JuegoInput): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}/juegos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(juego)
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const eliminarJuegoUsuario = async (userId: string, juegoId: string): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}/juegos/${juegoId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Juegos y Recomendaciones
export const getJuegos = async (): Promise<Juego[]> => {
  try {
    const response = await fetch(`${API_URL}/juegos`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error, []);
  }
};

export const buscarJuegosPorEtiquetas = async (etiquetas: string[]): Promise<Juego[]> => {
  try {
    const etiquetasQuery = etiquetas.join(',');
    const response = await fetch(`${API_URL}/juegos/buscar?etiquetas=${etiquetasQuery}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error, []);
  }
};

export const getRecomendacionesGenerales = async (etiquetas?: string[]): Promise<Juego[]> => {
  try {
    let url = `${API_URL}/recomendaciones`;
    if (etiquetas && etiquetas.length > 0) {
      url += `?etiquetas=${etiquetas.join(',')}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error, []);
  }
};

export const getRecomendacionesPersonalizadas = async (userId: string): Promise<Juego[]> => {
  try {
    const response = await fetch(`${API_URL}/recomendaciones/${userId}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    return handleFetchError(error, []);
  }
};