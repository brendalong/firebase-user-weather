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

function getUserWeather(userObj){
    //either get weather from user obj or make call to weather
    //make API Call
   if (userObj.weatherTime != null){
        if (helper.compareDateHelper(user.getUserObj().weatherTime, new Date())){
            console.log("compare true");
            console.log("use weather in obj");
        }else{
            console.log("compare false");
            getUpdateWeather(userObj.zip);
        }
    }else{
      console.log("no weather, go get some", userObj.zip);
      getUpdateWeather(userObj.zip);
    }
}

function getUpdateWeather(zip){
    //get weather
    getWeatherByZip(zip)
    .then((weather) => {
        let userObj = {
            weatherTime: new Date(),
            weather: weather.main.temp
        };
         return user.setUserVars(userObj);
      }).then((userObj) => {
         console.log("userObj", userObj);
         db.updateUserFB(userObj)
         .then(() => {
            user.showUser(userObj);
         });
      });
}



module.exports = { getWeatherByZip, getUpdateWeather, getUserWeather };