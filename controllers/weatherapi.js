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
    console.log(response.data);
    return response.data[0];
  } catch (e) {
    console.log(e);
  }

  return undefined;
};

const getCurrentWeather = async (lat, lon) => {
  if (!(lat && lon)) {
    return undefined;
  }
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`);
  return response.data;
};

module.exports = { getLocation, getCurrentWeather };
