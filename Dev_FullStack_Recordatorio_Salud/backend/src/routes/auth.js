import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Simple in-memory user store (in production, use a database)
const users = {};

const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

// Helper function to hash passwords
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

router.post('/login', loginValidation, validateRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    if (!users[email]) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    if (users[email].passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: users[email].id, email },
      process.env.JWT_SECRET || 'super-secret-jwt-token',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        id: users[email].id,
        email
      } 
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', loginValidation, validateRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    if (users[email]) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create new user
    const id = crypto.randomUUID();
    users[email] = {
      id,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    // Generate JWT token
    const token = jwt.sign(
      { id, email },
      process.env.JWT_SECRET || 'super-secret-jwt-token',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      token, 
      user: {
        id,
        email
      } 
    });
  } catch (error) {
    next(error);
  }
});

export default router;