const weatherRouter = require('express').Router();
const _ = require('lodash');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');
const { getCurrentWeather } = require('./weatherapi');

weatherRouter.post('/', userExtractor, async (request, response) => {
  const {
    city, lat, lon,
  } = request.body;
  const duplicate = _.find(request.user.location, { lat, lon });

  if (duplicate) {
    response.status(400).json({
      error: 'location already added',
    });
  }

  const weather = await getCurrentWeather(lat, lon);
  console.log(weather);
  const newLocations = { locations: request.user.locations.concat({ city, lat, lon }) };
  console.log(newLocations);
  await User.findByIdAndUpdate(request.user.id, newLocations);
  response.status(201).send(weather);
});

weatherRouter.get('/', userExtractor, async (request, response) => {
  const { locations } = request.user;
  const weatherPromises = [];
  for (let i = 0; i < locations.length; i += 1) {
    // array of promises
    console.log(locations[i].lat);
    weatherPromises.push(getCurrentWeather(locations[i].lat, locations[i].lon));
  }
  const weather = await Promise.all(weatherPromises);
  console.log(weather);
  // resolves promises and sends weawther data
  response.status(200).send(weather);
});

// weatherRouter.delete('/:lat%lon', userExtractor, async (request, response) => {
//   const { city, country } = request.body;
//   for (let i = 0; i < request.user.location; i += 1) {
//     if (_.isEqual(request.user.location[i], { city, country })) {
//       response.status(400).json({
//         error: 'location already added',
//       });
//     }
//   }

//   const user = { ...request.user, location: request.user.location.concat({ city, country }) };
//   await User.findByIdAndUpdate(request.user.id, user);
//   response.status(201);
// });

module.exports = weatherRouter;
