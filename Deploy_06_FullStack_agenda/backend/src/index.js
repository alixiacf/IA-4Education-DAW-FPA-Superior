import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { tareaRoutes } from './routes/tareas.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tareas', tareaRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});