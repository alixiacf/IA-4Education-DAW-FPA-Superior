import mongoose from 'mongoose';

const tareaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  horasEstimadas: {
    type: Number,
    required: true,
    min: 0
  },
  horasReales: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export const Tarea = mongoose.model('Tarea', tareaSchema);