Session.set('gameStatus', "waiting");

Template.game.helpers({
	// Used to dynamically switch the template partial based
	// on what the status of the game is.
	// This needs to be switched from Session to MongoDB query
	getTemplate: function () {
		if ( Session.get('gameStatus') === "waiting") {
			return 'gameLobby'
		} else {
			return 'board'
		}
	}, 

	// Gives the partial templates data
	getDataContext: function () {
		var currentGameID = Router.current().params.gameID;
		return Rounds.findOne({ 'game._id': currentGameID });
	},

	// TEMP: Switch to mongoquery
	gameStatus: function () {
		return Session.get('gameStatus');
	},

	getSessionID: function () {
		//TEMP: find by user session
		return Meteor.default_connection._lastSessionId;
		// Meteor.call('getSessionID', function (error, id) {
		// 	console.log(id)
		// 	return id
		// });
	},

	players: function () {
		var players = this.players.map(function (sessionID) {
			return { sessionID: sessionID }
		})
		return players;
	}
});

Template.game.events({
	'click button': function () {
		//TEMP: remove
		if (Session.get('gameStatus') === "waiting") {
			Session.set('gameStatus', 'inProgress')
		} else {
			Session.set('gameStatus', 'waiting');
		}

		Meteor.call('createRound', this, function (error, result) {
			//TEMP: Remove
			$('#temp').append("<p>Board id: " + result._id + "</p>")
		});

	}
});