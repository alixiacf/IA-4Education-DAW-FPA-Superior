/*
  # Health Management App Schema

  1. New Tables
    - `reminders`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `title` (text)
      - `description` (text)
      - `date` (timestamp)
      - `location` (text, nullable)
      - `type` (enum: daily, weekly, monthly)
      - `is_active` (boolean)
      - `user_id` (uuid, references auth.users)

    - `appointments`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `doctor_name` (text)
      - `specialty` (text)
      - `appointment_date` (timestamp)
      - `location` (text)
      - `notes` (text, nullable)
      - `user_id` (uuid, references auth.users)

    - `notifications`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `message` (text)
      - `type` (enum: email, push, whatsapp)
      - `status` (enum: pending, sent, read)
      - `reminder_id` (uuid, references reminders, nullable)
      - `appointment_id` (uuid, references appointments, nullable)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE reminder_type AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE notification_type AS ENUM ('email', 'push', 'whatsapp');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'read');

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  location text,
  type reminder_type NOT NULL,
  is_active boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  doctor_name text NOT NULL,
  specialty text NOT NULL,
  appointment_date timestamptz NOT NULL,
  location text NOT NULL,
  notes text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  message text NOT NULL,
  type notification_type NOT NULL,
  status notification_status DEFAULT 'pending',
  reminder_id uuid REFERENCES reminders(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  CONSTRAINT notification_reference CHECK (
    (reminder_id IS NOT NULL AND appointment_id IS NULL) OR
    (reminder_id IS NULL AND appointment_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own reminders"
  ON reminders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();