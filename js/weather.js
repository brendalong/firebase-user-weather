"use strict";
let $ = require('jquery'),
   user = require('./user'),
   db = require('./db-interaction'),
   helper = require('./helpers'),
   wKey = require('./weather-key');
//https://openweathermap.desk.com/customer/en/portal/articles/1996493-switching-between-temperature-units

const weatherKey = wKey.weatherKey;

function getWeatherByZip(zip) {
   //get new api key!!
   let zipUrl = `https://api.openweathermap.org/data/2.5/weather?APPID=${weatherKey}&zip=${zip},us&units=imperial`;
   return $.ajax({
      url: zipUrl,
      method: "GET"
   }).done((data) => {
      return data;
   }).fail((error) => {
      return error;
   });
}


module.exports = { getWeatherByZip };