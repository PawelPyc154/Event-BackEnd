const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Nazwa jest wymagana'],
    max: [50, 'Zbyt długa nazwa'],
  },
  describe: {
    type: String,
    trim: true,
    max: [500, 'Zbyt długi opis'],
  },
  slug: String,
  coordinates: {
    longitude: {
      type: Number,
      required: [true, 'Długość geograficzna jest wymagana'],
    },
    latitude: {
      type: Number,
      required: [true, 'Szerokość geograficzna jest wymagana'],
    },
  },
  place: {
    type: String,
    required: [true],
  },
  province: {
    type: String,
    required: [true],
  },
  date: {
    type: Number,
    required: [true, 'Data początku wydarzenia jest wymagana'],
  },
  type: {
    type: String,
    enum: ['dance', 'picnic'],
    default: 'dance',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  image: { type: String },
});

EventSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Event', EventSchema);
