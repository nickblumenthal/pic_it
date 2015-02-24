Meteor.methods({
	createGame: function (gameName) {
		// Gets the client's session ID
		var creatorID = this.connection.id;

		var game = {
			name: gameName,
			creatorID: creatorID,
			status: "waiting",
			players: [ creatorID ],
		};

		var gameID = Games.insert(game);

		return { gameID: gameID, creatorID: creatorID };
	},

	createRound: function (game) {
		Games.update(game._id, { $set: { status: "inProgress" }})
		var players = game.players;

		var drawer = players[Math.floor(Math.random()*players.length)];
		var started = new Date().getTime();

		var round = {
			game: game,
			drawer: drawer,
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
	},

	removeUser: function () {
		console.log(this.connection.id)
	},

	changeGameStatus: function (gameID) {
		var status = Games.findOne(gameID, { status: true }).status;
		if ( status === "waiting") {
			Games.update(gameID, { $set: { status: "inProgress" }})
		} else {
			Games.update(gameID, { $set: { status: "waiting" }})
		}
	},

	loadWordList: function(fileName) {

	  var wordList = Assets.getText('nounlist.txt');
	  var wordList = wordList.split('\n');
	  return wordList;
	}
})



// TEMP: Need to figure out a way to get the gameID to the callback
Meteor.publish("Game", function (gameID) {

	var sessionID = this.connection.id

	this._session.socket.on("close", Meteor.bindEnvironment(function () {

	}, function (e) { console.log(e) })
	);
	return Games.find( gameID );
})
