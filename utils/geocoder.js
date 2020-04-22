const NodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  // fetch: customFetchImplementation,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  language: 'pl',
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
