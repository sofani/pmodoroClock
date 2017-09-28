// declare timer and running variables
// to keep track of the running/stopped timer
var timer;
var isRunning = false;

// declare variables to keep track of session & break length
// and the current session/length
var breakLength = 5 * 60, sessionLength = 25 * 60;
var currentSession = "session", currentLength = sessionLength;

// declare variable for alarm ringtone
var bell = new Audio("http://www.oringz.com/oringz-uploads/sounds-929-another-hand-bell.mp3");

// formatNumber(num)
// function to convert all numbers to "##" format
function formatNumber(num) {
  return (num < 10) ? "0" + num : num;
}

// secsToTime(num)
// reformats number of seconds to "hh:mm:ss" time format
function secsToTime(num) {
  // make sure num is in fact a number
  num = parseInt(num)
  
  // calculate number of hours, minutes, and seconds in within num
  var hrs = Math.floor(num / 3600);
  var mins = Math.floor(num % 3600 / 60);
  var secs = Math.floor(num % 3600 % 60);
  
  // reformat the numbers into the "hh:mm:ss" segments
  hrs = (hrs > 0) ? formatNumber(hrs) + ":" : "";
  mins = (mins > 0) ? formatNumber(mins) + ":" : "00:";
  secs = formatNumber(secs);
  
  return hrs + mins + secs;
}

// timeToSecs(time)
// converts a time string to number of seconds it represents
function timeToSecs(time) {
  // create array of the "hh:mm:ss" segments
  time = time.split(":");
  var counter = 0, numSecs = 0;
  
  // convert each segment of array [hh, mm, ss] into number of seconds it represents
  while (time.length !== 0) {
      numSecs += parseInt(time.pop()) * Math.pow(60, counter);
      counter++;
  }
  
  return numSecs;
}

// setBackground()
// set '#filler' background height to cover a percentage area
// of the timer (based on time given)
function setBackground(time) {
  var current = timeToSecs(time);
  var percentage = 100 - Math.floor(current / currentLength * 100);
  $('#filler').css('height', percentage + '%');
}

// clock()
// decrements timer by a second
function clock() {
  // convert time left into total number of seconds and decrement by 1
  var secs = timeToSecs($('#time-left').text());
  secs--;
  
  // display new time 
  if (secs >= 0) {
      var str = secsToTime(secs);
      $('#time-left').text(str);
      setBackground(str);
      if (secs === 0) {
      	bell.play();
      }
    }
  // otherwise, timer is up and session needs to switch
  else
    {
      if (currentSession === "session")
        {
          currentSession = "break";
          currentLength = breakLength;
          $('#session').text("Break!");
          $('#filler').css('background-color',"#EB3333");
        }
      else
        {
          currentSession = "session";
          currentLength = sessionLength;
          $('#session').text("Session");
          $('#filler').css('background-color',"#FFAD00");
        }
      $('#time-left').text(secsToTime(currentLength));
      setBackground(secsToTime(currentLength));
    }
}

// startTime()
// begins running clock function every second
function startTime() {
  timer = setInterval(clock, 1000);
}

// stopTime()
// stops clock function from running
function stopTime() {
  clearInterval(timer);
}

// reset()
// resets timer back to session and stops it if it's running
function reset() {
  if (isRunning) {
      stopTime();
      isRunning = false;
  }
  currentSession = "session";
  currentLength = sessionLength;
  $('#session').text("Session");
  $('#filler').css('background-color',"#FFAD00");
  $('#filler').css('height',"0");
  $('#time-left').text(secsToTime(currentLength));
}

// toggleTime()
// runs either startTime() or stopTime() depending on timer's status
function toggleTimer() {
  if (isRunning) {
      stopTime();
      isRunning = false;
  } else {
      startTime();
      isRunning = true;
  }
}

// jQuery code to set minus/polus functionalities
$(document).ready(function() {
  
  // begin functionality code
  $("#break-minus").click(function() {
    // only run button's code if timer is not running
    if (!isRunning)
      {
        var num = parseInt($('#break-length').text());
        num = (num > 0) ? num - 1 : num;
        $("#break-length").text(num);
        breakLength = num * 60;
        // if adjusting break length while in a break session, reset timer
        if (currentSession === "break") {reset();}
      }
  });
  $("#break-plus").click(function() {
    // only run button's code if timer is not running
    if (!isRunning)
      {
        var num = parseInt($('#break-length').text());
        num++;
        $("#break-length").text(num);
        breakLength = num * 60;
        // if adjusting break length while in a break session, reset timer
        if (currentSession === "break") {reset();}
      }
  });
  $("#session-minus").click(function() {
    // only run button's code if timer is not running
    if(!isRunning)
      {
        var num = parseInt($('#session-length').text());
        num = (num > 1) ? num - 1 : num;
        $("#session-length").text(num);
        sessionLength = num * 60;
        // if adjusting session length while in a session, reset timer
        if (currentSession === "session") {
        	reset();
        }
      }
  });

  $("#session-plus").click(function() {
    // only run button's code if timer is not running
    if(!isRunning)
      {
        var num = parseInt($('#session-length').text());
        num++;
        $("#session-length").text(num);
        sessionLength = num * 60;
        // if adjusting session length while in a session, reset timer
        if (currentSession === "session") {reset();}
      }
  });
});