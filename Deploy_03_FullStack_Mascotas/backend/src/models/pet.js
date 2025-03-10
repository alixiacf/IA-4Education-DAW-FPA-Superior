import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true
  },
  fechaProxima: {
    type: String,
    required: true,
    // Convertimos la fecha de string a Date antes de guardar
    set: function(fechaStr) {
      return fechaStr;
    }
  }
});

const petSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  edad: {
    type: Number,
    required: true
  },
  raza: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['perro', 'gato', 'ave', 'otro']
  },
  foto: {
    type: String,
    required: true
  },
  propietarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vacunas: [vaccineSchema]
}, {
  timestamps: true
});

export default mongoose.model('Pet', petSchema);