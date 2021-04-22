'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

const superagent = require('superagent');

// Application Dependencies
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());

async function getWeatherHandler(request, response) {

  const lat = request.query.lat;
  const lon = request.query.lon;

  const key = process.env.WEATHER_API_KEY;

  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

  console.log('url', url);

  const weatherResponse = await superagent.get(url);

  const weatherObject = JSON.parse(weatherResponse.text);

  const weatherArray = weatherObject.data;

  const forecasts = weatherArray.map(day => new Forecast(day));

  response.send(forecasts);
}


class Forecast {
  constructor(day) {
    this.forecast = day.weather.description,
      this.time = day.datetime;
  }
}

async function getMoviesHandler(request, response) {
  const key = process.env.MOVIE_API_KEY;
  const query = 'Seattle';
  const url = `https://api.themoviedb.org/3/search/movie/?api_key=${key}&query=${query}`;
  // console.log('url', url);
  const moviesResponse = await superagent.get(url);
  const movies = JSON.stringify(moviesResponse.text);
  // console.log('movies', movies);
  response.send(movies);
}

app.get('/weather', getWeatherHandler);

app.get('/movies', getMoviesHandler);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
