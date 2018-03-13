"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
     provider = new firebase.auth.GoogleAuthProvider();

let currentUser = {
     uid: null,
     zipCode: null,
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
        if (currentUser.fbID === null){
            logOut();
        }
	}else {
        currentUser.uid = null;
        currentUser.zipCode = null;
        currentUser.weatherTime = null;
        currentUser.weather = null;
        currentUser.fbID = null;
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

function getUserZip(){
    return currentUser.zipCode;
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
        currentUser.fbID = obj.fbID ? obj.fbID : currentUser.fbID ;
        resolve(currentUser);
    });
}

function showUser(obj) {
   let userDetails = getUserObj();
   console.log("user.showUser: userDetails:", userDetails);
}


module.exports = {logInGoogle, logOut, getUser, setUser, getUserZip, setUserVars, getUserWeatherTime, getUserObj, showUser};
