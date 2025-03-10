import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import petRoutes from './routes/pets.js';
import clinicRoutes from './routes/clinics.js';
import Clinic from './models/clinic.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veterinary';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/usuarios', userRoutes);
app.use('/mascotas', petRoutes);
app.use('/clinicas', clinicRoutes);

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Agregar clínicas de ejemplo si no hay ninguna
    const clinicCount = await Clinic.countDocuments();
    if (clinicCount === 0) {
      console.log('Adding sample clinics...');
      try {
        await Clinic.insertMany([
          {
            nombre: 'Clínica Veterinaria Madrid Centro',
            direccion: 'Calle Gran Vía 34, Madrid',
            lat: 40.4200, 
            lng: -3.7025
          },
          {
            nombre: 'Hospital Veterinario 24h',
            direccion: 'Paseo de la Castellana 65, Madrid',
            lat: 40.4378, 
            lng: -3.6910
          },
          {
            nombre: 'Veterinario Retiro',
            direccion: 'Calle Alcalá 90, Madrid',
            lat: 40.4205, 
            lng: -3.6853
          },
          {
            nombre: 'Centro Veterinario Chamberí',
            direccion: 'Calle Fuencarral 112, Madrid',
            lat: 40.4290, 
            lng: -3.7019
          },
          {
            nombre: 'Clínica Veterinaria Malasaña',
            direccion: 'Calle San Bernardo 67, Madrid',
            lat: 40.4256, 
            lng: -3.7066
          }
        ]);
        console.log('Sample clinics added successfully');
      } catch (error) {
        console.error('Error adding sample clinics:', error);
      }
    }
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});