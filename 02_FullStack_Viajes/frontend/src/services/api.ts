import { supabase } from '../lib/supabase';
import type { User, Place } from '../types';

export const api = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, userData: Omit<User, '_id' | 'createdAt'>) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          avatar: userData.avatar
        }
      }
    });
    if (authError) throw authError;

    // Crear perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user!.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      })
      .select()
      .single();

    if (profileError) throw profileError;
    return profileData;
  },

  async getCurrentUser() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;
    return {
      _id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      createdAt: profile.created_at
    };
  },

  async getUserPlaces(userId: string): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return data.map(place => ({
      _id: place.id,
      userId: place.user_id,
      location: {
        lat: place.lat,
        lng: place.lng
      },
      type: place.type as 'visited' | 'desired',
      review: place.review,
      experienceTemp: place.experience_temp,
      createdAt: place.created_at
    }));
  },

  async createPlace(placeData: Omit<Place, '_id' | 'createdAt'>): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .insert({
        user_id: placeData.userId,
        lat: placeData.location.lat,
        lng: placeData.location.lng,
        type: placeData.type,
        review: placeData.review,
        experience_temp: placeData.experienceTemp
      })
      .select()
      .single();

    if (error) throw error;

    return {
      _id: data.id,
      userId: data.user_id,
      location: {
        lat: data.lat,
        lng: data.lng
      },
      type: data.type as 'visited' | 'desired',
      review: data.review,
      experienceTemp: data.experience_temp,
      createdAt: data.created_at
    };
  }
};