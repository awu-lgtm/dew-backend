const axios = require('axios');
const { OPEN_WEATHER_KEY } = require('../utils/config');
// import isoCountries from 'i18n-iso-countries';

const getLocation = async (city, country) => {
  if (city === '') {
    return undefined;
  }

  let code = '';
  // const countryCode = isoCountries.getAlpha2Code(country, 'en');
  // if (countryCode) {
  //   code = `,${countryCode}`;
  // }

  try {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}${code}&appid=${OPEN_WEATHER_KEY}`);
    console.log('weather');
    return response.data[0];
  } catch (e) {
    console.log(e);
  }

  return undefined;
};

// gets current weather data
const getCurrentWeather = async (city, lat, lon) => {
  if (!(lat && lon)) {
    return undefined;
  }
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`);
  response.data.name = city;
  response.data.coord.lat = lat;
  response.data.coord.lon = lon;
  return response.data;
};

// gets current, minutely, hourly, 5 day forecast, and alerts
const getAllWeather = async (city, lat, lon) => {
  if (!(lat && lon)) {
    return undefined;
  }
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`);
  response.data.name = city;
  response.data.lat = lat;
  response.data.lon = lon;
  return response.data;
};

module.exports = { getLocation, getCurrentWeather, getAllWeather };
