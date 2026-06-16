import mongoose from 'mongoose';

const applyAvailabilityFromStock = (target) => {
  if (target && target.stock !== undefined) {
    target.available = Number(target.stock) > 0;
  }
};

const cafeSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  roast: {
    type: String,
    enum: ['Claro', 'Medio', 'Oscuro'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  minimumStock: {
    type: Number,
    default: 0,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

cafeSchema.pre('save', function syncAvailability() {
  applyAvailabilityFromStock(this);
});

cafeSchema.pre('findOneAndUpdate', function syncAvailability() {
  const update = this.getUpdate() || {};
  applyAvailabilityFromStock(update);
  this.setUpdate(update);
});

export default mongoose.model('Cafe', cafeSchema);
