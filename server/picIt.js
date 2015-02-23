Meteor.methods({
	createGame: function (gameName) {
		// Gets the client's session ID
		var creatorID = this.connection.id;

		var game = {
			name: gameName,
			players: [ creatorID ]
		};

		var gameID = Games.insert(game);

		return { gameID: gameID, creatorID: creatorID };
	},

	createRound: function (game) {
		var started = new Date().getTime();

		var round = {
			game: game,
			board: {
				started: started,
				updated: started 
			},
			lines: {}
		}

		var roundID = Rounds.insert( round );
		var round = Rounds.findOne( roundID );

		return round;
	},

	joinGame: function (gameID, sessionID) {
		Games.update(gameID, { $addToSet: { players: sessionID }})
	},

	boardUpdated: function (roundID) {
		var now = new Date().getTime();
		
		Rounds.update({ _id: roundID }, { $set: { 'board.updated': now }})

		return "working" 
	},

	createLine: function (roundID, color, width, x0, y0, x1, y1) {

	},


	getSessionID: function () {
		console.log(this.connection.id)
		return this.connection.id;
	}
})




Meteor.publish("Games", function () {
	Games.find();
})