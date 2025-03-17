import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Obtener todas las notificaciones del usuario
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    console.log('Obteniendo notificaciones para el usuario:', req.user.id);
    
    const notifications = await Notification.find({ 
      user_id: req.user.id 
    }).sort({ created_at: -1 });
    
    console.log('Notificaciones encontradas:', notifications.length);
    res.json(notifications);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    next(error);
  }
});

// Marcar notificación como leída
router.patch('/:id/read', authenticateToken, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { status: 'read', updated_at: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al actualizar notificación:', error);
    next(error);
  }
});

// Eliminar todas las notificaciones
router.delete('/', authenticateToken, async (req, res, next) => {
  try {
    await Notification.deleteMany({ user_id: req.user.id });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar notificaciones:', error);
    next(error);
  }
});

// Crear una nueva notificación
router.post('/', authenticateToken, [
  body('message').notEmpty().trim(),
  body('type').isIn(['email', 'push', 'whatsapp']),
], validateRequest, async (req, res, next) => {
  try {
    console.log('Creando nueva notificación:', req.body);
    
    const notification = new Notification({
      ...req.body,
      user_id: req.user.id,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('Datos de notificación a insertar:', notification);
    
    const savedNotification = await notification.save();
    console.log('Notificación creada exitosamente:', savedNotification);
    
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor', 
      details: error.message || 'Error desconocido'
    });
  }
});

export default router;