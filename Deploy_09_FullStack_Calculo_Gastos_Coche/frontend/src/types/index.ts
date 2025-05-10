export interface Trip {
  _id: string;
  destino: string;
  carModel: string;
  consumoMedio: number;
  kilometros: number;
  precioCombustible: number;
  precioTotal: number;
  viajerosNecesarios: number;
  viajerosConfirmados: number;
  fecha: Date;
  tipoCombustible: string;
  conductor: string;
  notas: string;
  precioPorViajero: number;
}

export interface Car {
  _id: string;
  modelo: string;
  marca: string;
  consumoMedio: number;
  tipoCombustible: string;
  capacidadPasajeros: number;
}

export type TripInput = Omit<Trip, '_id' | 'precioTotal' | 'fecha' | 'precioPorViajero'>;

export interface CalculationInput {
  kilometros: number;
  consumo: number;
  precio: number;
  viajeros: number;
  tipoCombustible: 'Gasolina' | 'Diesel' | 'Eléctrico';
}

export interface CalculationResult {
  kilometros: number;
  consumoMedio: number;
  precioCombustible: number;
  viajeros: number;
  precioTotal: number;
  precioPorViajero: number;
}