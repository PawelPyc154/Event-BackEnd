const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
// middleware
const errorHandler = require('./middleware/error');
// modules
const protect = require('./modules/protect');
const routes = require('./modules/routes');
const socket = require('./modules/socket');
const connectDB = require('./modules/db');
const devHeplers = require('./modules/devHeplers');

dotenv.config({ path: './config/config.env' }); // load env vars

connectDB();

const app = express();
const serverHttp = http.createServer(app);

socket(serverHttp);

app.use(express.json()); // Json parser
app.use(cookieParser()); // Cookie parser

devHeplers(app);
protect(app);

// passport
require('./modules/passport');

app.use(passport.initialize());

// routes
routes(app);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = serverHttp.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold),
);

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red);
  server.close(() => process.exit(1)); // Close server
});
