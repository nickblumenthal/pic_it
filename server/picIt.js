Meteor.methods({
	createGame: function (gameName) {
		// Gets the client's session ID
		var creatorID = this.connection.id;

		var game = {
			name: gameName,
			creatorID: creatorID,
			status: "waiting",
			timer: 0,
			players: [ creatorID ],
		};

		var gameID = Games.insert(game);

		return { gameID: gameID, creatorID: creatorID };
	},

	createRound: function (game) {
		Games.update(game._id, { $set: { status: "inProgress", timer: 5 }})
		var players = game.players;

		// Assign a random drawer and guesser
		var drawerNum = Math.floor(Math.random()*players.length);
		var guesserNum = players.length - 1 - drawerNum;
		var drawer = players[drawerNum];
		var guesser = players[guesserNum];
		console.log('drawer:' + drawer);
		console.log('guesser:' + guesser);

		var started = new Date().getTime();

		var round = {
			game: game,
			drawer: drawer,
			guesser: guesser,
			board: {
				started: started,
				updated: started
			},
			lines: {}
		}

		var roundID = Rounds.insert( round );
		// TEMP: This needs to get updated
		var round = Rounds.findOne( roundID );

		return round;
	},

	joinGame: function (gameID, sessionID) {
		var game = Games.findOne(gameID);
		if(game.players.length < 2) {
			Games.update(gameID, { $addToSet: { players: sessionID }})
		}
	},

	leaveGame: function (gameID, sessionID) {
		Games.update(gameID, { $pull: { players: sessionID } })
	},

	boardUpdated: function (roundID) {
		var now = new Date().getTime();

		Rounds.update({ _id: roundID }, { $set: { 'board.updated': now }})

		return "working"
	},

	createLine: function (roundID, color, width, x0, y0, x1, y1) {
		return Lines.insert({ _id:Meteor.uuid() , round_id: roundID , width: width , color: color , points: [ {x:x0 , y:y0} , {x:x1 , y:y1} ] });
	},

	pushPoint: function (line_id, x, y) {
		Lines.update({ _id: line_id }, { $push: { points : {x:x,y:y} } });
	},

	getSessionID: function () {
		return this.connection.id;
	},

	removeUser: function (playerID, gameID) {
		Games.update(gameID, { $pull: { players: playerID }});
	},

	changeGameStatus: function (gameID) {
		var status = Games.findOne(gameID, { status: true }).status;
		if ( status === "waiting") {
			Games.update(gameID, { $set: { status: "inProgress", timer: 60 }})
		} else {
			Games.update(gameID, { $set: { status: "waiting", timer: 0 }})
		}
	},

	loadWordList: function(fileName) {

	  var wordList = Assets.getText('nounlist.txt');
	  var wordList = wordList.split('\n');
	  return wordList;
	}, 

	clearLines: function (roundID) {
		Lines.remove({ round_id: roundID });	
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
