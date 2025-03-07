import { User, Pet, Clinic } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellidos: 'Pérez',
    contacto: {
      telefono: '+34 600 123 456',
      email: 'juan@example.com'
    }
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'García',
    contacto: {
      telefono: '+34 600 789 012',
      email: 'maria@example.com'
    }
  }
];

export const mockPets: Pet[] = [
  {
    id: '1',
    nombre: 'Max',
    edad: 3,
    raza: 'Labrador',
    tipo: 'perro',
    foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    propietarioId: '1',
    vacunas: [
      {
        id: '1',
        tipo: 'Rabia',
        fechaProxima: '2024-06-15'
      },
      {
        id: '2',
        tipo: 'Parvovirus',
        fechaProxima: '2024-08-20'
      }
    ]
  },
  {
    id: '2',
    nombre: 'Luna',
    edad: 2,
    raza: 'Siamés',
    tipo: 'gato',
    foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    propietarioId: '1',
    vacunas: [
      {
        id: '3',
        tipo: 'Triple Felina',
        fechaProxima: '2024-07-10'
      }
    ]
  },
  {
    id: '3',
    nombre: 'Rocky',
    edad: 4,
    raza: 'Pastor Alemán',
    tipo: 'perro',
    foto: 'https://images.unsplash.com/photo-1553882809-a4f57e59501d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    propietarioId: '2',
    vacunas: [
      {
        id: '4',
        tipo: 'Rabia',
        fechaProxima: '2024-09-01'
      },
      {
        id: '5',
        tipo: 'Leptospirosis',
        fechaProxima: '2024-05-30'
      }
    ]
  }
];

export const mockClinics: Clinic[] = [
  {
    id: '1',
    nombre: 'Clínica Veterinaria Central',
    direccion: 'Calle Principal 123',
    lat: 40.416775,
    lng: -3.703790
  },
  {
    id: '2',
    nombre: 'Hospital Veterinario Norte',
    direccion: 'Avenida Norte 456',
    lat: 40.426775,
    lng: -3.713790
  },
  {
    id: '3',
    nombre: 'Centro Veterinario Sur',
    direccion: 'Plaza Mayor 789',
    lat: 40.406775,
    lng: -3.693790
  }
];