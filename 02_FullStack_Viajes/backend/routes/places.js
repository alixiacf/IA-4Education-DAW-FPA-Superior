const express = require('express');
const { createPlace, getPlacesByUser } = require('../controllers/placesController');

const router = express.Router();

router.post('/', createPlace);
router.get('/user/:userId', getPlacesByUser);

module.exports = router;
