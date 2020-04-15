const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  slug: String,
  coordinates: {
    longitude: { type: Number, required: [true, 'Please add a longitude'] },
    latitude: { type: Number, required: [true, 'Please add a longitude'] },
  },
  place: { type: String, required: [true, 'Please add place'] },
  province: { type: String, required: [true, 'Please add voivodeship'] },
  time: { start: { type: Number }, end: { type: Number } },
  type: { type: String, enum: ['dance', 'picnic'], default: 'dance' },
  attractions: { type: [String], enum: ['dance', 'picnic'] },
  fbList: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);
