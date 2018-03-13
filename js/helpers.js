"use strict";

function compareDateHelper(firstDate, newDate) {
   let oldDate = new Date(firstDate);
   return oldDate.getFullYear() === newDate.getFullYear() && oldDate.getDate() === newDate.getDate() && oldDate.getMonth() === newDate.getMonth();
}

module.exports = {compareDateHelper};