const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name'],
    max: [50, 'Too long'],
  },
  describe: {
    type: String,
    trim: true,
    max: [500, 'Too long'],
  },
  slug: String,
  coordinates: {
    longitude: {
      type: Number,
      required: [true, 'Please add a longitude'],
    },
    latitude: {
      type: Number,
      required: [true, 'Please add a longitude'],
    },
  },
  place: {
    trim: true,
    type: String,
    required: [true, 'Please add place'],
  },
  province: {
    type: String,
    // enum: [
    //   'dolnośląskie',
    //   'kujawsko-pomorskie',
    //   'lubuskie',
    //   'łódzkie',
    //   'małopolskie',
    //   'mazowieckie',
    //   'opolskie',
    //   'podkarpackie',
    //   'podlaskie',
    //   'pomorskie',
    //   'śląskie',
    //   'świętokrzyskie',
    //   'warmińsko-mazurskie',
    //   'wielkopolskie',
    //   'zachodniopomorskie',
    //   '',
    // ],
  },
  date: {
    type: Number,
    required: [true, 'Please add event time start'],
  },

  type: {
    type: String,
    enum: ['dance', 'picnic'],
    default: 'dance',
  },
  fbList: {
    type: Boolean,
    default: false,
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
});

EventSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Event', EventSchema);
