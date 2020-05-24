const events = require('../routes/events');
const auth = require('../routes/auth');
const contact = require('../routes/contact');

const routes = (app) => {
  app.use('/api/events', events);
  app.use('/api/auth', auth);
  app.use('/api/contact', contact);
};

module.exports = routes;
