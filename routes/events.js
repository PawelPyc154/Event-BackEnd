const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const {
  getEvents,
  createEvent,
  deleteEvent,
} = require('../controllers/events');
const { protect } = require('../middleware/auth');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: { limiter: `Dodałeś zbyt dużo wydarzeń, spróbuj za godzine` },
  },
});

router.route('/').get(getEvents).post(limiter, protect, createEvent);
router.route('/:id').delete(protect, deleteEvent);

module.exports = router;
