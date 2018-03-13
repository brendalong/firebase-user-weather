"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./fb-config"),
    user = require("./user");

// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// POST - Submits data to be processed to a specified resource.

//example with delete
// function deleteItem(fbID) {
// 	return $.ajax({
//       	url: `${firebase.getFBsettings().databaseURL}/songs/${fbID}.json`,
//       	method: "DELETE"
// 	}).done((data) => {
// 		return data;
// 	});
// }


// GET - Requests/read data from a specified resource
// PUT - Update data to a specified resource.

function getFBDetails(user){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}//user.json?orderBy="uid"&equalTo="${user}"`
     }).done((resolve) => {
        return resolve;
     }).fail((error) => {
        return error;
     });
  }

function addUserFB(userObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/user.json`,
        type: 'POST',
        data: JSON.stringify(userObj),
        dataType: 'json'
     }).done((fbID) => {
        return fbID;
     });
}

function updateUserFB(userObj){
   //  console.log("updateFB", userObj);
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/user/${userObj.fbID}.json`,
        type: 'PUT',
        data: JSON.stringify(userObj),
        dataType: 'json'
     }).done((userID) => {
        return userID;
     });
}

function addWeatherToUser(data){
    let currentUser = user.getUser();
    console.log("this is the currentUser", currentUser);
    // return $.ajax({
    //     url: `${firebase.getFBsettings().databaseURL}/user.json?orderBy="uid"&equalTo="${currentUser}`,
    //     type: 'PUT',
    //     data: JSON.stringify(data),
    //     dataType: 'json'
    //  }).done((userID) => {
    //     return userID;
    //  });
}

module.exports = {
    getFBDetails,
    addUserFB,
    updateUserFB,
    addWeatherToUser
};
