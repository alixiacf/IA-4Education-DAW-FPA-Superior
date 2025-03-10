import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Clinic', clinicSchema);