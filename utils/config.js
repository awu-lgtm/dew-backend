require('dotenv').config();

const { PORT } = process.env;
const { MONGODB_URI } = process.env;
const { OPEN_WEATHER_KEY } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
  OPEN_WEATHER_KEY,
};
