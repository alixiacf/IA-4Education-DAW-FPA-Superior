export interface User {
  id?: string;
  nombre: string;
  apellidos: string;
  contacto: {
    telefono: string;
    email: string;
  };
}

export interface Vaccine {
  id?: string;
  tipo: string;
  fechaProxima: string;
}

export interface Pet {
  id?: string;
  _id?: string; // Añadimos _id porque MongoDB devuelve los objetos con _id
  nombre: string;
  edad: number;
  raza: string;
  tipo: string;
  foto: string;
  propietarioId: string;
  vacunas: Vaccine[];
}

export interface Clinic {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
}