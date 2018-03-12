"use strict";


let firebase = require("firebase/app"),
    fb = require("./fb-key"),
    fbData = fb();

require("firebase/auth");
require("firebase/database");

var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL
};


firebase.initializeApp(config);

firebase.getFBsettings = () => {
	console.log("getFBsettings", config);
	return config;
};

module.exports = firebase;


