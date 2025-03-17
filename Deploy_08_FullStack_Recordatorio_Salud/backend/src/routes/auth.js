import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middleware/validateRequest.js';
import User from '../models/User.js';

const router = express.Router();

const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

router.post('/login', loginValidation, validateRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario en MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    
    // Verificar contraseña con bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    
    // Generar JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'super-secret-jwt-token',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        email: user.email
      } 
    });
  } catch (error) {
    console.error('Error en login:', error);
    next(error);
  }
});

router.post('/register', loginValidation, validateRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Verificar si ya existe un usuario con este email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }
    
    // Crear nuevo usuario con Mongoose
    const user = new User({
      email,
      password // Se hasheará automáticamente gracias al middleware en el modelo
    });
    
    await user.save();
    
    // Generar JWT token
    const token = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET || 'super-secret-jwt-token',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      token, 
      user: {
        id: user._id,
        email
      } 
    });
  } catch (error) {
    console.error('Error en registro:', error);
    next(error);
  }
});

export default router;