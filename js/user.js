"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
   db = require("./db-interaction"),
   weather = require("./weather"),
   helper = require('./helpers'),
   $ = require("jquery");

let defaultCode = 37027;

let currentUser = {
     uid: null,
     zipCode: null,
     weatherTime: null,
     weather: null,
     fbID: null
    };

// call logout when page loads to avoid currentUser.uid
// db.logOut();
//listen for changed state
firebase.auth().onAuthStateChanged((user) => {
	console.log("onAuthStateChanged", user);
	if (user){
		currentUser.uid = user.uid;
      console.log("current user Logged in?", currentUser);
	}else {
      currentUser.uid = null;
      currentUser.zipCode = null;
      currentUser.weatherTime = null;
      currentUser.weather = null;
      currentUser.fbID = null;
      console.log("current user NOT logged in:", currentUser);
	}
});


function getUser(){
	return currentUser.uid;
}

function setUser(val){
	currentUser.uid = val;
}

function getUserWeatherTime(){
    return currentUser.weatherTime;
}

function getUserObj(){
    return currentUser;
}

function setUserVars(obj){
    console.log("user.setUserVars: obj", obj);
    return new Promise((resolve, reject) => {
        currentUser.zipCode = obj.zipCode ? obj.zipCode : currentUser.zipCode;
        currentUser.weatherTime = obj.weatherTime ? obj.weatherTime : currentUser.weatherTime;
        currentUser.weather = obj.weather ? obj.weather : currentUser.weather ;
        currentUser.fbID = obj.fbID ? obj.fbID : currentUser.fbID;
        currentUser.uid = obj.uid ? obj.uid : currentUser.uid;
        resolve(currentUser);
    });
}

function showUser(obj) {
   let userDetails = getUserObj();
   console.log("user.showUser: userDetails:", userDetails);
   $("#currentTemp").html(`${userDetails.weather} F`);
}

function checkUserFB(uid){
    db.getFBDetails(uid)
    .then((result) => {
        let data = Object.values(result);
        console.log("user: any data?", data.length);
        if (data.length === 0){
            console.log("need to add this user to FB" , data);
           db.addUserFB(makeUserObj(uid))
            .then((result) => {
               console.log("user: user added", uid, result.name);
               let tmpUser = {
                  zipCode: defaultCode,
                  fbID: result.name,
                  uid: uid
               };
               return tmpUser;
            }).then((tmpUser) => {
                  return setUserVars(tmpUser);
            }).then((userObj) => {
               getUserWeather(userObj);
            });
        }else{
            console.log("user: already a user", data);
            var key = Object.keys(result);
            data[0].fbID = key[0];
            setUserVars(data[0])
               .then((resolve) => {
                  getUserWeather(resolve);
               });
        }
      //only show once a user is logged in
       $("#zip-container").removeClass("is-hidden");
    });
}

function getUserWeather(userObj) {
   //either get weather from user obj or make call to weather
   //make API Call
   console.log("getUserWeather: userObj", getUserObj());
   if (userObj.weatherTime != null) {
      if (helper.compareDateHelper(getUserObj().weatherTime, new Date())) {
         console.log("user.getUserWeather: compare true");
         console.log("user.getUserWeather: use weather in obj");
         showUser(userObj);
      } else {
         console.log("user.getUserWeather: compare false", userObj.zipCode);
         getUpdateWeather(userObj.zipCode);
      }
   } else {
      console.log("user.getUserWeather: no weather, go get some", userObj.zipCode);
      getUpdateWeather(userObj.zipCode);
   }
}

function getUpdateWeather(zip) {
   //get weather
   weather.getWeatherByZip(zip)
      .then((weather) => {
         let userObj = {
            weatherTime: new Date(),
            weather: weather.main.temp
         };
         return setUserVars(userObj);
      }).then((userObj) => {
         db.updateUserFB(userObj)
            .then(() => {
               showUser(userObj);
            });
      });
}


function makeUserObj(uid){
   let userObj = {
      uid: uid,
      zipCode: defaultCode
   };
   return userObj;
}
/////////////////// Login with email and password
function emailRegister(){
   console.log("you clicked register");
   if ($("#email-input").val() != "" && $("#password-input").val() != ""){
      db.createUser({
         email: $("#email-input").val(),
         password: $("#password-input").val()
      })
      .then((userData) => {
         checkUserFB(userData.uid);
      }, (error) => {
         console.log("Error creating user:", error);
      });
   }
}

function emailLogin(){
   console.log("you clicked email login");
   if ($("#email-input").val() != "" && $("#password-input").val() != "") {
      let account = {
         email: $("#email-input").val(),
         password: $("#password-input").val()
      };
      db.loginUser(account)
      .then((userData) => {
         checkUserFB(userData.uid);
      }, (error) => {
         console.log("Error with login:", error);
      });
   }
}


module.exports = {
   checkUserFB,
   emailRegister,
   emailLogin,
   getUser,
   setUser,
   setUserVars,
   getUserWeatherTime,
   getUserObj,
   showUser,
   getUserWeather
};
