import express from 'express';
import { body } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validación para crear/actualizar citas
const appointmentValidation = [
  body('doctor_name').notEmpty().trim(),
  body('specialty').notEmpty().trim(),
  body('appointment_date').isISO8601(),
  body('location').notEmpty().trim(),
  body('reminder_minutes').isInt({ min: 0 }),
];

// Obtener todas las citas del usuario
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Crear una nueva cita
router.post('/', authenticateToken, appointmentValidation, validateRequest, async (req, res, next) => {
  try {
    console.log('Creando nueva cita:', req.body);
    console.log('Usuario autenticado:', req.user);
    
    const appointment = {
      ...req.body,
      user_id: req.user.id,
    };

    console.log('Datos de cita a insertar:', appointment);

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();

    if (error) {
      console.error('Error al insertar cita en Supabase:', error);
      return res.status(500).json({ 
        message: 'Error al crear la cita', 
        details: error.message, 
        hint: error.hint || '', 
        code: error.code || '' 
      });
    }

    console.log('Cita creada exitosamente:', data);

    // Crear notificación para la nueva cita
    const notification = {
      message: `Nueva cita médica programada con ${appointment.doctor_name}`,
      type: 'email',
      status: 'pending',
      user_id: req.user.id,
      appointment_id: data.id,
    };

    console.log('Creando notificación:', notification);

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([notification]);

    if (notificationError) {
      console.error('Error al crear notificación:', notificationError);
      // No fallamos la respuesta principal, solo registramos el error
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error general al crear cita:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor', 
      details: error.message || 'Error desconocido'
    });
  }
});

// Eliminar una cita
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;