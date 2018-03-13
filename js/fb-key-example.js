"use strict";

function getKey() {
   return {
      apiKey: "reallyLongValue",
      authDomain: "something.firebaseapp.com",
      databaseURL: "https://something.firebaseio.com"
   };
}
//something is your fb address

module.exports = getKey;
