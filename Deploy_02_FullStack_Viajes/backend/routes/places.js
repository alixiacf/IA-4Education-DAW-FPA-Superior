const express = require('express');
const Place = require('../models/Place');
const { createPlace, getPlacesByUser } = require('../controllers/placesController');

const router = express.Router();

// Crear un nuevo lugar
router.post('/', createPlace);

// Obtener lugares de un usuario específico
router.get('/user/:userId', getPlacesByUser);

// Obtener todos los lugares (con información de usuario)
router.get('/', async (req, res) => {
  try {
    const places = await Place.find()
      .populate('userId', 'name avatar email')
      .exec();

    // Transformar los datos para que coincidan con el formato esperado
    const formattedPlaces = places.map(place => ({
      _id: place._id,
      userId: place.userId._id,
      userName: place.userId.name,
      userAvatar: place.userId.avatar,
      location: place.location,
      type: place.type,
      review: place.review,
      experienceTemp: place.experienceTemp,
      createdAt: place.createdAt
    }));

    res.json(formattedPlaces);
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    res.status(500).json({ message: 'Error al obtener lugares' });
  }
});

module.exports = router;