/*
  # Añadir tiempo de recordatorio para citas médicas

  1. Cambios
    - Añadir columna `reminder_minutes` a la tabla `appointments`
      - Valor por defecto: 30 minutos
      - No puede ser nulo
    - Actualizar las citas existentes con el valor por defecto
*/

ALTER TABLE appointments
ADD COLUMN reminder_minutes integer NOT NULL DEFAULT 30;

COMMENT ON COLUMN appointments.reminder_minutes IS 'Minutos antes de la cita para enviar el recordatorio';