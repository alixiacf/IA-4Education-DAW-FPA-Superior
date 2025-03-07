export interface JuegoUsuario {
  _id?: string;
  titulo: string;
  etiquetas: string[];
}

export interface Usuario {
  _id: string;
  nombre: string;
  juegos: JuegoUsuario[];
}

export interface Juego {
  _id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  etiquetas: string[];
}

export type UsuarioInput = Omit<Usuario, '_id'>;
export type JuegoInput = {
  titulo: string;
  etiquetas: string[];
};