"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
     provider = new firebase.auth.GoogleAuthProvider();

let currentUser = {
     uid: null,
     zip: null,
     weatherTime: null,
     weather: null,
     fbID: null
    };

//listen for changed state
firebase.auth().onAuthStateChanged((user) => {
	console.log("onAuthStateChanged", user);
	if (user){
		currentUser.uid = user.uid;
		console.log("current user Logged in?", currentUser);
	}else {
		currentUser.uid = null;
		console.log("current user NOT logged in:", currentUser);
	}
});

function logInGoogle() {
	//all firebase functions return a promise!! Add a then when called

	return firebase.auth().signInWithPopup(provider);
}

function logOut(){
	return firebase.auth().signOut();
}
function getUser(){
	return currentUser.uid;
}

function setUser(val){
	currentUser.uid = val;
}

// function setUserZip(obj){
//     currentUserZip = obj.zipCode;
// }

function getUserZip(){
    return currentUser.zip;
}

function getUserWeatherTime(){
    return currentUser.weatherTime;
}

function getUserObj(){
    return currentUser;
}

function setUserVars(obj){
    return new Promise((resolve, reject) => {
        currentUser.zip = obj.zipCode ? obj.zipCode : currentUser.zip;
        currentUser.weatherTime = obj.weatherTime ? obj.weatherTime : currentUser.weatherTime;
        currentUser.weather = obj.weather ? obj.weather : currentUser.weather ;
        currentUser.fbID = obj.fbID ? obj.fbID : currentUser.fbID ;
        resolve(currentUser);
    });
}

function showUser(obj) {
   let userDetails = getUserObj();
   console.log("showUser got details:", userDetails);
}


module.exports = {logInGoogle, logOut, getUser, setUser, getUserZip, setUserVars, getUserWeatherTime, getUserObj, showUser};
