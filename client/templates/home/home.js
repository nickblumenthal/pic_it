Template.home.events({
	'click #create': function(event, tmp) {
		createGame(tmp);
	},

	'keypress #gameName': function (event, tmp) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
	  if(keycode == '13'){
	  	createGame(tmp);
    }
	},

	'click .tour': function(event) {
		console.log('click');
		// Instance the tour
		var tour = new Tour({
		  steps: [
		  {
		    title: "PicIt",
		    content: "PicIt is a realtime pictionary game.",
				orphan: true
		  },
		  {
		    element: ".games-container",
		    title: "Join a game",
		    content: "Click an existing game to join or..."
		  },
		  {
		    element: "#gameName",
		    title: "Start a game",
		    content: "Create a new game by entering your game name here. Try it now.",
		  	reflex: true
			},
			{
		    element: "#create",
		    title: "Create a game",
		    content: "Click here to create your new game.",
		  	reflex: true
			},
			{
		    orphan: true,
		    title: "Game lobby",
		    content: "This is where you play the game."
			},
			{
		    element: "#sidebar",
		    title: "User Options",
		    content: "These are your options."
			},
			{
		    element: "#username-span",
		    title: "Username",
		    content: "Click here to set your username",
				reflex: true
			},
			{
		    element: "#players",
		    title: "Players",
		    content: "The lobby shows other players and their scores.  You earn points by guessing correctly and by getting people to guess your picture.  The faster you get other players to guess your drawing the more points you earn."
			},
			{
		    element: "#create-round",
		    title: "Start a round",
		    content: "Click here to start a round.  Try it out.",
				reflex: true
			},
			{
		    element: "#timer",
		    title: "Countdown",
		    content: "The timer shows the countdown to start the round and how much time you have in each round",
				duration: 6000,
				placement: 'bottom'
			},
			{
		    element: "#board",
		    title: "The game",
		    content: "If you are the drawer, your word will appear at the top.  If you're a guesser you can type your guesses in the bottom."
			},
			{
		    element: "#guesses",
		    title: "Guess list",
		    content: "Other players guesses will show up here in real time.",
				placement: 'left'
			},
			{
		    orphan: true,
		    title: "The end",
		    content: "That's it! Invite your friends, start drawing and have fun!",
			},




		]});

		// Initialize the tour
		tour.init(true);
		tour.goTo(0);

		// Start the tour
		tour.start(true);
	}
});

Template.home.rendered = function () {
	Session.set('notFirstHook', true);

	$('.sidebar-toggle').on('touchstart', function() {
		console.log('click');
  	$('#sidebar').toggleClass('collapsed')
	});

};

Template.home.destroyed = function() {
	$('.sidebar-toggle').off('touchstart');
}

var createGame = function (tmp) {
	var gameName = this.$('#gameName').val();

	if (!validName(gameName)) {
		// Give an error
		return;
	}

	Meteor.call('createGame', gameName, function (error, result) {
		if (error) { console.log(error) };

		if (result) {
			console.log("Create Game: " + gameName);
			// Redirect to game lobby
			Router.go('game', { gameID: result.gameID })
		};
	});
}

var validName = function (gameName) {
	var gameName = $.trim(gameName)

	return ( gameName === "" ? false : true )
}
