const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// dev helper
require('colors');
const morgan = require('morgan');
// protect
const cors = require('cors');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// conect DB
const conectDB = require('./config/db');
// middleware
const errorHandler = require('./middleware/error');

// routes
const events = require('./routes/events');
const auth = require('./routes/auth');
const contact = require('./routes/contact');
// ///////////////////////////////////////////////////////////////////////

dotenv.config({ path: './config/config.env' }); // load env vars
conectDB(); // conect DB

const app = express();

app.use(express.json()); // Json parser
app.use(cookieParser()); // Cookie parser
app.use(morgan('dev')); // Dev loggin middleware

// Protect
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    error: { limiter: `Zbyt dużo zapytań, spróbuj za godzine` },
  },
});
app.use(limiter);
app.use(fileupload());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors({ credentials: true, origin: true }));

// passport
require('./passport');

app.use(passport.initialize());

// routes
app.use('/api/events', events);
app.use('/api/auth', auth);
app.use('/api/contact', contact);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold),
);

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red);
  server.close(() => process.exit(1)); // Close server
});
