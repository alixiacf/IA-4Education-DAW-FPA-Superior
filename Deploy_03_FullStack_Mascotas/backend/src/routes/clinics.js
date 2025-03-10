import express from 'express';
import Clinic from '../models/clinic.js';

const router = express.Router();

// Get all clinics
router.get('/', async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.json(clinics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;