"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user"),
    weather = require("./weather");

// Using the REST API
// function loadSongsToDOM() {
//   console.log("Need to load some songs, Buddy");
//   let currentUser = user.getUser(); //add once we have login
//   console.log("currentUser in loadSongs", currentUser);
//   db.getSongs(currentUser)
//   // db.getSongs()
//   .then((songData) => {
//     console.log("got data", songData);
//     //with users, this is already happening...
//     //add the id to each song and then build the song list
//     // var idArray = Object.keys(songData);
//     // idArray.forEach((key) => {
//     //   songData[key].id = key;
//     // });
//     // console.log("song object with id", songData);
//     //now make the list with songData
//     templates.makeSongList(songData);
//   });
// }


// Version 1 - without user login //////////////////////////
// function loadSongsToDOM() {
//   console.log("Need to load some songs, Buddy");
//   db.getSongs()
//   .then((songData) => {
//     console.log("got data", songData);
//     //add the id to each song and then build the song list
//     var idArray = Object.keys(songData);
//     idArray.forEach((key) => {
//       songData[key].id = key;
//     });
//     console.log("song object with id", songData);
//     //now make the list with songData
//     templates.makeSongList(songData);
//   });
// }
// loadSongsToDOM();




// Send newSong data to db then reload DOM with updated song data
// $(document).on("click", ".save_new_btn", function() {
//   console.log("click save new song");
//   let songObj = buildSongObj();
//   db.addSong(songObj)
//   .then((songID) => {
//     loadSongsToDOM();
//   });
// });


// go get the song from database and then populate the form for editing.
//used with fat arrows, 'this' is not the same as below. Use event.target instead.
// $(document).on("click", ".edit-btn", function () {
//   console.log("click edit song");
//   let songID = $(this).data("edit-id");
//   db.getSong(songID)
//   .then((song) => {
//     return templates.songForm(song, songID);
//   })
//   .then((finishedForm) => {
//     $(".uiContainer--wrapper").html(finishedForm);
//   });
// });


//Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {
//   let songObj = buildSongObj(),
//     songID = $(this).attr("id");
//     console.log("songID", songID);
//     db.editSong(songObj, songID)
//     .then((data) => {
//       loadSongsToDOM();
//     });
// });


// Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function () {
//   console.log("clicked delete song", $(this).data("delete-id"));
//   let songID = $(this).data("delete-id");
//   db.deleteSong(songID)
//   .then(() => {
//      loadSongsToDOM();
//   });
// });


//make the view button work.
//not needed when user logs in since that will
//handle showing songs
// $("#view-songs").click(function() {
//     $(".uiContainer--wrapper").html("");
//     loadSongsToDOM();
// });


//***************************************************************
// User login section. Should ideally be in its own module
$("#login").click(function() {
  console.log("clicked login");
  user.logInGoogle()
  .then((result) => {
    console.log("result from login", result.user.uid);
    // user = result.user.uid;
    user.setUser(result.user.uid);
    $("#login").addClass("is-hidden");
    $("#logout").removeClass("is-hidden");
    checkUserFB(result.user.uid);
  });
});

$("#logout").click(() => {
  console.log("logout clicked");
  user.logOut();
});

function checkUserFB(uid){
    db.getFBDetails(uid)
    .then((result) => {
        let data = Object.values(result);
        console.log("any data?", data.length);
        if (data.length === 0){ 
            console.log("need to add this user to FB" , data);
            makeUserObj(user);
        }else{
            console.log("already a user", data);
            //need to check date and compare to today and possibly call the weather api or not
            //data is returned as array. use first item.
            var idArray = Object.keys(data);
            idArray.forEach((key) => {
                data[key].fbID = key;
            });
            // data.fbID = data[0];
            console.log("widh fbID?", data[0]);
            user.setUserVars(data[0])
            .then((userInfo) => {
                console.log("setUserInfo", userInfo);
                getUserWeather(userInfo.zip);
            });
        }
    });
}

function makeUserObj(user){
    let userObj = {
        uid: user,
        zipCode: 37027
    };
    db.addUserFB(userObj)
    .then((result) => {
        console.log("user added, now get the weather", result);
        //need to confirm result format
        // user.setUserVars(result);
        // getUserWeather(result.zipCode);
    });
}

function getUserWeather(zip){
    //either get weather from user obj or make call to weather
    //make API Call
    if (user.getUserObj().weatherTime != null){
        if (compareDateHelper(user.getUserObj().weatherTime, new Date())){
            console.log("compare true");
            console.log("use weather in obj");
        }else{
            console.log("compare false");
            getUpdateWeather();
        }
    }else{
        console.log("no weather, go get some");
        getUpdateWeather();
    }
}

function getUpdateWeather(){
    //get weather
    weather.getWeatherByZip(user.getUserZip())
    .then((weather) => {
        console.log("got some user weather", weather);
        console.log("got some user weather", weather.main.temp);
        let userObj = {
            weatherTime: new Date(),
            weather: weather.main.temp
        };
        let newObj = user.setUserVars(userObj).then((obj) => {
            console.log("what obj", obj);
            return obj;
        });
        return newObj;
    }).then((userObj) => {
        db.updateUserFB(userObj)
        .then(showUser(userObj));
    });
}


function showUser(FBID){
    console.log("FBID", FBID);
    let userDetails = user.getUserObj();
    console.log("showUser:", userDetails);
}

function compareDateHelper(oldDate, newDate){
    return oldDate.getFullYear() === newDate.getFullYear() && oldDate.getDate() === newDate.getDate() && oldDate.getMonth() === newDate.getMonth();
}