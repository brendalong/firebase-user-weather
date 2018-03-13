"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user"),
    weather = require("./weather");

let defaultCode = 37027;

//***************************************************************
$("#login").click(function() {
  console.log("clicked login");
  user.logInGoogle()
  .then((result) => {
    console.log("result from login", result.user.uid);
    user.setUser(result.user.uid);
    $("#login").addClass("is-hidden");
    $("#logout").removeClass("is-hidden");
    checkUserFB(result.user.uid);
  });
});

$("#logout").click(() => {
    console.log("logout clicked");
    user.logOut();
    $("#login").removeClass("is-hidden");
    $("#logout").addClass("is-hidden");
});

function checkUserFB(uid){
    db.getFBDetails(uid)
    .then((result) => {
        let data = Object.values(result);
        console.log("any data?", data.length);
        if (data.length === 0){
            console.log("need to add this user to FB" , data);
           db.addUserFB(makeUserObj(uid))
            .then((result) => {
               console.log("user added", result.name);
               let tmpUser = {
                  zipCode: defaultCode,
                  fbID: result.name,
                  uid: uid
               };
               return tmpUser;
            }).then((tmpUser) => {
               // console.log("tmpUser", tmpUser);
                  return user.setUserVars(tmpUser);
            }).then((userObj) => {
               // console.log("userObj", userObj);
               weather.getUserWeather(userObj);
            });
        }else{
            console.log("already a user", data);
            var key = Object.keys(result);
            data[0].fbID = key[0];
            user.setUserVars(data[0])
            .then((userObj) => {
                console.log("user vars begore getUserWeather", userObj);
               weather.getUserWeather(userObj);
            });
        }
    });
}

function makeUserObj(user){
   let userObj = {
      uid: user,
      zipCode: defaultCode
   };
   return userObj;
}

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
            console.log("new zip user", userObj);
            //get new weather
            weather.getUserWeather(userObj);
        });
      
      //update FBUser with updated obj
   }
}
