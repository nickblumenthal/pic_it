Template.game.helpers({
	// Used to dynamically switch the template partial based
	// on what the status of the game is.
	getTemplate: function () {
		if ( this.status === "waiting") {
			return 'gameLobby'
		} else {
			return 'board'
		}
	},

	// Gives the partial templates data
	getDataContext: function () {
		// var currentGameID = Router.current().params.gameID;
		var gameID = this._id;
		if ( this.status === "waiting") {
			return this
		} else {
			// TEMP: Have to figure out how to find the latest round
			return Rounds.findOne({ 'game._id': gameID }, { sort: { 'board.started' : -1 }});
		}
	},

	// TEMP: Switch to mongoquery. Update: maybe not- ('this' is reactive)
	gameStatus: function () {
		return this.status;
	},

	inProgress: function () {
		if ( this.status === "waiting") {
			return false;
		} else if ( this.status === "inProgress" ){
			return true;
		}
	},

	getSessionID: function () {
		//TEMP: find by user session
		return Meteor.default_connection._lastSessionId;
		// Meteor.call('getSessionID', function (error, id) {
		// 	console.log(id)
		// 	return id
		// });
	},

	getRoundID: function () {
		var round;
		if(round = Rounds.findOne({ 'game._id': Session.get('gameID') }, { sort: { 'board.started': -1 }})) {
			return round._id;
		} else {
			return 'Waiting to start round.'
		}
	},

	players: function () {
		var players = this.players.map(function (sessionID) {
			return { sessionID: sessionID }
		})
		return players;
	},

	rounds: function () {
		var gameID = this._id;
		return Rounds.find({ 'game._id': gameID })
	}
});


Template.game.events({
	'click #create-round': function () {
		var game = this;

		Meteor.call('createRound', game, function (error, result) {
			if (result) {
				Session.set('currentRound', result._id);
				console.log("returned")
			};
		});
	},

	'click #end-round': function (event) {
		Meteor.call('changeGameStatus', this._id, function (error, result) {

		})
	}
});

Template.game.rendered = function () {

	var game = this.data;

	// Create FlipClock.js element
	clock = new FlipClock($('#countdown'), {
		clockFace: 'Counter',
		autoStart: false,
		countdown: true
	})

	// Sets clock to whatever the current game is
	clock.setTime(game.timer)

	// Reactively observing timer changes of the mongo entry 
	// Only updates the counter if the change is for the timer
	Games.find( game._id ).observeChanges({
		changed: function (id, fields) {
			if (fields.timer != null) {
				clock.setTime(fields.timer)
			};
		}
	});
};