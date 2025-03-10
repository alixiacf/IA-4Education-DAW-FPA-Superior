const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    type: { type: String, enum: ['visited', 'desired'], required: true },
    review: String,
    experienceTemp: Number
}, { timestamps: true });

module.exports = mongoose.model('Place', PlaceSchema);
