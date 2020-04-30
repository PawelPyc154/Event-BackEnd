const Event = require('../models/Event');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const translate = require('../utils/translate');
const ErrorResponse = require('../utils/errorResponse');

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
  const adress = await geocoder.reverse({
    lat: req.body.coordinates.latitude,
    lon: req.body.coordinates.longitude,
  });
  req.body.place = adress[0].city;
  req.body.province = translate(adress[0].stateCode);

  const event = await Event.create(req.body);
  res.status(200).json({ success: true, data: event });
});

// @desc         Delete event
// @route        DELETE /api/event/:id
// @access       Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorizated to update this event`,
        401,
      ),
    );
  }

  event.remove();

  res.status(200).json({ succees: true, data: {} });
});

// @desc         Update event
// @route        PUT /api/event/:id
// @access       Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorizated to update this event`,
        401,
      ),
    );
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ succees: true, data: event });
});
