const express = require('express');

const router = express.Router();

const { getEvents, createEvent } = require('../controllers/events');
const { protect } = require('../middleware/auth');

router.route('/').get(getEvents).post(protect, createEvent);

module.exports = router;
