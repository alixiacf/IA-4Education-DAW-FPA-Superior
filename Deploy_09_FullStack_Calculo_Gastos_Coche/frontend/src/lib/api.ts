const API_BASE_URL = 'http://localhost:3000';

export async function fetchTrips(): Promise<Trip[]> {
  const response = await fetch(`${API_BASE_URL}/viajes`);
  if (!response.ok) throw new Error('Failed to fetch trips');
  return response.json();
}

export async function fetchTrip(id: string): Promise<Trip> {
  const response = await fetch(`${API_BASE_URL}/viajes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch trip');
  return response.json();
}

export async function createTrip(trip: TripInput): Promise<{viaje: Trip, redirect?: string, mensaje?: string}> {
  const response = await fetch(`${API_BASE_URL}/viajes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip),
  });
  if (!response.ok) throw new Error('Failed to create trip');
  return response.json();
}

export async function joinTrip(tripId: string): Promise<{viaje: Trip, redirect?: string, mensaje?: string, precioPorViajero?: number}> {
  const response = await fetch(`${API_BASE_URL}/viajes/${tripId}/join`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to join trip');
  return response.json();
}

export async function fetchCars(): Promise<Car[]> {
  const response = await fetch(`${API_BASE_URL}/coches`);
  if (!response.ok) throw new Error('Failed to fetch cars');
  return response.json();
}

export async function searchCars(query: string): Promise<Car[]> {
  const response = await fetch(`${API_BASE_URL}/coches/buscar?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search cars');
  return response.json();
}

export async function calculateCosts(input: CalculationInput): Promise<CalculationResult> {
  const params = new URLSearchParams({
    kilometros: input.kilometros.toString(),
    consumo: input.consumo.toString(),
    precio: input.precio.toString(),
    viajeros: input.viajeros.toString(),
  });
  const response = await fetch(`${API_BASE_URL}/calcular?${params}`);
  if (!response.ok) throw new Error('Failed to calculate costs');
  return response.json();
}