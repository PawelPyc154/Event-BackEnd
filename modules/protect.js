const cors = require('cors');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 25,
  message: {
    error: { limiter: `Zbyt dużo zapytań, spróbuj za godzine` },
  },
});

const protect = (app) => {
  app.use(limiter);
  app.use(fileupload());
  app.use(mongoSanitize());
  app.use(helmet());
  app.use(xss());
  app.use(hpp());
  app.use(cors({ credentials: true, origin: true }));
};
module.exports = protect;
