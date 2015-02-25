Template.game.helpers({
	// Used to dynamically switch the template partial based
	// on what the status of the game is.
	// This needs to be switched from Session to MongoDB query
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

	// TEMP: Switch to mongoquery
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
		var roundStarting = true;

		// Create coutdown if Round creation successful
		startRound(game)
	},


	'click #end-round': function (event) {
		Meteor.call('changeGameStatus', this._id, function (error, result) {

		})
	}
});

var startRound = function (game) {
	Meteor.call('createRound', game, function (error, result) {
		if (result) {
			Session.set('currentRound', result._id);
		};
	});
}

Template.game.rendered = function () {

	var game = this.data;


	clock = new FlipClock($('#countdown'), {
		clockFace: 'Counter',
		autoStart: false,
		countdown: true
	})

	Games.find( game._id ).observeChanges({
		changed: function (id, fields) {
			clock.setTime(fields.timer)
		}
	});;
	// Sets clock to whatever the current time is
	clock.setTime(game.timer)

};




// Create coutdown if Round creation successful
		// var clock = new FlipClock($('#countdown'), 5, {
		// 	clockFace: 'Counter',
		// 	autoStart: true,
		// 	countdown: true,
		// 	callbacks: {
		// 		stop: function () {
		// 			if (roundStarting) {
						
		// 				startRound(game);

		// 				clock.setTime(10)
		// 				clock.start();
		// 				roundStarting = false;
		// 			} else {
		// 				debugger 
		// 			}
		// 		}
		// 	}
		// })

