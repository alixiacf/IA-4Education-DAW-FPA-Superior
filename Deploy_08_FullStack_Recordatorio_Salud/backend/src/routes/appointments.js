import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken } from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';

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
    const appointments = await Appointment.find({ 
      user_id: req.user.id 
    }).sort({ appointment_date: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    next(error);
  }
});

// Crear una nueva cita
router.post('/', authenticateToken, appointmentValidation, validateRequest, async (req, res, next) => {
  try {
    console.log('Creando nueva cita:', req.body);
    console.log('Usuario autenticado:', req.user);
    
    // Crear cita en MongoDB
    const appointment = new Appointment({
      ...req.body,
      user_id: req.user.id,
    });

    console.log('Datos de cita a insertar:', appointment);

    const savedAppointment = await appointment.save();
    
    console.log('Cita creada exitosamente:', savedAppointment);

    // Crear notificación para la nueva cita
    const notification = new Notification({
      message: `Nueva cita médica programada con ${req.body.doctor_name}`,
      type: 'email',
      status: 'pending',
      user_id: req.user.id,
      appointment_id: savedAppointment._id,
    });

    console.log('Creando notificación:', notification);

    try {
      await notification.save();
    } catch (notificationError) {
      console.error('Error al crear notificación:', notificationError);
      // No fallamos la respuesta principal, solo registramos el error
    }

    res.status(201).json(savedAppointment);
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
    // Eliminar cita por ID y verificar que pertenece al usuario
    const result = await Appointment.deleteOne({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    next(error);
  }
});

export default router;