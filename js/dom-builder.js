"use strict";
// This module only cares about the data it receives. It doesn't have to know about where the data comes from.

let $ = require('jquery');

function makeSongList(songList) {
  let songsDisplay =
  $(`<div class="uiContainer__song-list box col s12">
    <ul class="song-list">
    </ul>
  </div>`);
  $(".uiContainer--wrapper").html(songsDisplay);
  for (let song in songList ) {
    let currentSong = songList[song],
        songListItem = $("<li>", {class: "song-list__item"}),
        title = $("<span/>", {class: "song-title"}).text(currentSong.title),
        songListData = $("<ul/>", {class: "song-list__item--data"}),
        songListEdit = $("<a>", {"data-edit-id": song, class: "edit-btn waves-effect waves-light btn", text: "edit" }),
        songListDelete = $("<a>", {"data-delete-id": song, class: "delete-btn waves-effect waves-light btn", text: "delete" });
        // Same as `<a id="${song}" class="delete-btn waves-effect waves-light btn">delete</a>`

    songListData.append(
      `<li>${currentSong.artist}</li>
      <li>${currentSong.album}</li>
      <li>${currentSong.year}</li>`);

    $(".song-list").append(songListItem.append(title));
    $(".song-list").append(songListItem.append(songListData).append(songListDelete).append(songListEdit));
  }
}



function songForm(song, songId) {
  return new Promise((resolve, reject) => {
    let songItem = {
      title: song ? song.title : "",
      artist: song ? song.artist : "",
      year: song ? song.year : "",
      album: song ? song.album : "",
      formTitle: song ? `Edit "${song.title}"` : "Add a new song",
      btnText: song ? "save changes" : "save song",
      btnId: song ? "save_edit_btn" : "save_new_btn"  // identify which action to take
    },
    form =
      `<h3>${songItem.formTitle}</h3>
      <input type="text" id="form--title" placeholder="title" value="${songItem.title}"></input>
      <input type="text" id="form--artist" placeholder="artist" value="${songItem.artist}"></input>
      <input type="text" id="form--album" placeholder="album" value="${songItem.album}"></input>
      <input type="text" id="form--year" placeholder="year" value="${songItem.year}"></input>
      <button id="${songId}" class=${songItem.btnId}>${songItem.btnText}</button>`;
    resolve(form);
  });
}

module.exports = {
  makeSongList,
  songForm
};
