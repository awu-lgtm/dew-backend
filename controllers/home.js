const homeRouter = require('express').Router();
const { getAllWeather } = require('./weatherapi');

homeRouter.post('/', async (request, response) => {
  console.log(request);
  const { city } = request.body;
  let { lat, lon } = request.body;
  lat = `${lat}`;
  lon = `${lon}`;
  console.log(city, lat, lon);

  const weather = await getAllWeather(city, lat, lon);
  // resolves promises and sends weather data
  if (!weather) {
    return response.status(400).end();
  }
  return response.status(200).send(weather);
});

module.exports = homeRouter;
