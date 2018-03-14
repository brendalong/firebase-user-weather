"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user"),
    weather = require("./weather");


// $("#logout").addClass("is-hidden");
// $("#zip-container").addClass("is-hidden");

//***************************************************************
$("#login").click(function() {
  console.log("clicked login");
  db.logInGoogle()
  .then((result) => {
    console.log("result from login", result.user.uid);
    user.setUser(result.user.uid);
    $("#login").addClass("is-hidden");
    $("#logout").removeClass("is-hidden");
    user.checkUserFB(result.user.uid);
  });
});

$("#logout").click(() => {
    console.log("main.logout clicked");
    db.logOut();
    $("#login").removeClass("is-hidden");
    $("#logout").addClass("is-hidden");
});

/////// email and register
$("#login-email").click(() => {
   console.log("clicked login email");
   user.emailLogin();
});

$("#register-email").click(() => {
   console.log("clicked register");
   user.emailRegister();
});
//////////////////
//change zip
$("#change-zip").click(() => {
   getZipCodeVal();
});

function getZipCodeVal(event){
   // console.log("new zip", zipInput.val());
   if ($("#zip-input").val() != ""){
      let newZip = $("#zip-input").val();
      $("#zip-input").val("");
      //update userObj with new zip and
      //remove temp and time from user obj
      let updateUserObj = {
          zipCode: newZip,
          weatherTime: "old",
          weather: "old"
      };
      user.setUserVars(updateUserObj)
      .then((userObj) => {
            console.log("main: new zip user", userObj);
            //get new weather
            user.getUserWeather(userObj);
        });
   }
}

