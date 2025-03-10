export interface Location {
  lat: number;
  lng: number;
}

export interface Place {
  _id?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  location: Location;
  type: 'visited' | 'desired';
  review?: string;
  experienceTemp?: number;
  createdAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}