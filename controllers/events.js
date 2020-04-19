const Event = require('../models/Event');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
// @desc         Get all bootcamps
// @route        GET /api/bootcamps
// @access       Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find().populate({ path: 'user', select: 'name' });
  res.status(200).json({ success: true, count: events.length, data: events });
});
// @desc         Create bootcamp
// @route        POST /api/bootcamps
// @access       Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const event = await Event.create(req.body);
  res.status(200).json({ success: true, data: event });
});
