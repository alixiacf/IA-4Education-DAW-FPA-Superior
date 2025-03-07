const Place = require('../models/Place');

exports.createPlace = async (req, res) => {
    try {
        const { userId, location, type, review, experienceTemp } = req.body;

        // Validaciones de entrada
        if (!userId || !location || !location.lat || !location.lng || !type) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        if (!['visited', 'desired'].includes(type)) {
            return res.status(400).json({ error: "El tipo debe ser 'visited' o 'desired'" });
        }

        // Crear y guardar el lugar
        const place = new Place({ userId, location, type, review, experienceTemp });
        await place.save();
        res.status(201).json(place);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.getPlacesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "userId es requerido" });
        }

        const places = await Place.find({ userId });
        res.json(places);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los lugares" });
    }
};
