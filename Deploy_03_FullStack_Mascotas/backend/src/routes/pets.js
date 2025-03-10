import express from 'express';
import Pet from '../models/pet.js';

const router = express.Router();

// Create pet
router.post('/', async (req, res) => {
  try {
    console.log('Datos recibidos para crear mascota:', JSON.stringify(req.body));
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error al crear mascota:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get pets by user
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find({ propietarioId: req.query.propietarioId });
    res.json(pets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete pet
router.delete('/:id', async (req, res) => {
  try {
    console.log('Petición para eliminar mascota con ID:', req.params.id);
    const result = await Pet.findByIdAndDelete(req.params.id);
    console.log('Resultado de la eliminación:', result);
    
    if (!result) {
      console.log('No se encontró la mascota con ID:', req.params.id);
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    
    console.log('Mascota eliminada correctamente');
    res.status(200).json({ message: 'Mascota eliminada' });
  } catch (error) {
    console.error('Error al eliminar mascota:', error.message);
    res.status(400).json({ message: error.message });
  }
});

export default router;