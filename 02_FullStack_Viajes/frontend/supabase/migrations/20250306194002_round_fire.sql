/*
  # Crear tablas iniciales para la aplicación de mapas de viaje

  1. Nuevas Tablas
    - `profiles`
      - `id` (uuid, primary key) - ID del usuario de Supabase Auth
      - `name` (text) - Nombre del usuario
      - `email` (text) - Email del usuario
      - `avatar` (text) - URL del avatar
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `places`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Referencia al perfil del usuario
      - `lat` (double precision) - Latitud
      - `lng` (double precision) - Longitud
      - `type` (text) - Tipo de lugar ('visited' o 'desired')
      - `review` (text) - Reseña del lugar
      - `experience_temp` (integer) - Puntuación de la experiencia
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas para que los usuarios puedan:
      - Ver y actualizar su propio perfil
      - Ver y gestionar sus propios lugares
*/

-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de lugares
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  type text NOT NULL CHECK (type IN ('visited', 'desired')),
  review text,
  experience_temp integer CHECK (experience_temp BETWEEN 1 AND 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas para lugares
CREATE POLICY "Users can view their own places"
  ON places
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own places"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own places"
  ON places
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own places"
  ON places
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);