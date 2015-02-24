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
			return Rounds.findOne({ 'game._id': gameID });		
		}
	},

	// TEMP: Switch to mongoquery
	gameStatus: function () {
		return this.status;
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

});