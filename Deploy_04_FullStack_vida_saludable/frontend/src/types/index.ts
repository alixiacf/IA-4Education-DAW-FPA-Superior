export interface Entrenamiento {
  fecha: Date;
  detalle: string;
  duracion: number;
  calorias: number;
}

export interface Dieta {
  fecha: Date;
  descripcion: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface Progreso {
  peso?: number;
  medidas?: string;
  entrenamientos: Entrenamiento[];
  dietas: Dieta[];
}

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  progreso: Progreso;
}

// Para los formularios
export type UsuarioInput = Omit<Usuario, '_id'>;
export type EntrenamientoInput = Omit<Entrenamiento, 'fecha'>;
export type DietaInput = Omit<Dieta, 'fecha'>;