const weatherRouter = require('express').Router();
const _ = require('lodash');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');
const { getCurrentWeather } = require('./weatherapi');

weatherRouter.post('/', userExtractor, async (request, response) => {
  const { city } = request.body;
  let { lat, lon } = request.body;
  lat = `${lat}`;
  lon = `${lon}`;
  const duplicate = _.find(request.user.locations, { lat, lon });

  // responds with an error if location is already added
  if (duplicate) {
    return (
      response.status(400).json({
        error: 'location already added',
      })
    );
  }

  const weather = await getCurrentWeather(city, lat, lon);
  const newLocations = { locations: request.user.locations.concat({ city, lat, lon }) };
  await User.findByIdAndUpdate(request.user.id, newLocations);
  return response.status(201).send(weather);
});

weatherRouter.get('/', userExtractor, async (request, response) => {
  const { locations } = request.user;
  const weatherPromises = [];
  for (let i = 0; i < locations.length; i += 1) {
    // array of promises
    weatherPromises.push(getCurrentWeather(locations[i].city, locations[i].lat, locations[i].lon));
  }
  const weather = await Promise.all(weatherPromises);
  // resolves promises and sends weather data
  response.status(200).send(weather);
});

weatherRouter.delete('/', userExtractor, async (request, response) => {
  let { lat, lon } = request.body;
  console.log(lat, lon);
  lat = `${lat}`;
  lon = `${lon}`;
  console.log(typeof lat);
  const newLocations = { locations: _.reject(request.user.locations, { lat, lon }) };

  await User.findByIdAndUpdate(request.user.id, newLocations);
  response.status(200).send(newLocations);
});

module.exports = weatherRouter;
