getCurrentRound = function(gameID) {
  return Rounds.findOne({ 'game._id': gameID }, { sort: { 'board.started' : -1 }});
}

Template.registerHelper('rounds', function () {
	var gameID = this._id
	return Rounds.find({ 'game._id': gameID })
})

Template.registerHelper('gameInProgress', function () {
	return ( this.status !== "finished" ? true : false)
})

// Launches app into fullscreen
launchIntoFullscreen = function (element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

exitFullscreen = function () {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

fullScreenEnabled = function() {
  var fullscreenEnabled = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

  return fullscreenEnabled;
}

// Animation end names used as hooks for page transitions
// TEMP: Need to add the Modernizr operation here
animEndEventNames = {
	'WebkitAnimation' : 'webkitAnimationEnd',
	'OAnimation' : 'oAnimationEnd',
	'msAnimation' : 'MSAnimationEnd',
	'animation' : 'animationend'
}

// TEMP: Added this here because lib gets loaded before Modernizr
// therefore causing an error
animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ]