Meteor.methods({
	createGame: function (gameName) {
		// Gets the client's session ID
		var creatorID = this.connection.id;

		var game = {
			name: gameName,
			creatorID: creatorID,
			status: "waiting",
			timer: 0,
		};

		var gameID = Games.insert(game);

		return { gameID: gameID, creatorID: creatorID };
	},

	startCountdown: function (game) {
		// Countdown before beginning of round
		Games.update(game._id, { $set: { timer: 5 }})

		// Incrementing the countdown for pre-round
		var intervalID = Meteor.setInterval( function() {
			Games.update( game._id, { $inc: { timer: -1 }})
			var Game = Games.findOne( game._id )

			if (Game.timer == 0) {
				Meteor.clearInterval( intervalID )
				Meteor.call('startGame', Game);
			};
			}, 1000)
	},


	createRound: function (game) {
		// Removing pre-round countdown, initiate round
		Meteor.setTimeout(function () {
			Meteor.clearInterval(intervalID)
			Games.update(game._id, { $set: { status: "inProgress" }})
		}, 6000)

		var players = game.players;

		// Assign a random drawer
		var drawerNum = Math.floor(Math.random()*players.length);
		var drawer = players[drawerNum];

		var started = new Date().getTime();

		// Chose a random word
		var chosenWord = Meteor.call('getRandomWord', 'nounlist.txt');

		var round = {
			game: game,
			drawer: drawer,
			board: {
				started: started,
				updated: started
			},
			lines: {},
			guessedWords: [],
			chosenWord: chosenWord,
			won: false
		}

		var roundID = Rounds.insert( round );

		var round = Rounds.findOne( roundID, { sort: { 'board.started' : -1 }});

		return round;
	},

	startGame: function (game) {
		var gameID = game._id;

		Meteor.call( 'createRound', game )

		Games.update( gameID, { $set: { status: "inProgress", timer: 60 }});

		// Incrementing the countdown for pre-round
		var intID = Meteor.setInterval( function() {

			Games.update( game._id, { $inc: { timer: -1 }})
			var Game = Games.findOne( game._id )

			if (Game.timer === 30) { Meteor.call( 'endRound', gameID )}
		  }, 1000)

		hack.gameID = intID;

	},

	endRound: function (gameID) {
		Meteor.call('assignPoints', gameID);
		// TEMP: Part of the hack
		Meteor.clearInterval( hack.gameID )
		delete hack.gameID

		// Count the number of rounds
		var count = Rounds.find({ 'game._id': gameID }).count()

		if (count >= 4) {
			Meteor.call('endGame', gameID)
		} else {
			Games.update( gameID, { $set: { status: "waiting", timer: 0 }})
		}
	},

	endGame: function (gameID) {
		Games.update( gameID, { $set: { status: "finished", timer: 0 }})
	},

	joinGame: function (gameID, sessionID) {
		var game = Games.findOne(gameID);
		Games.update(gameID, { $addToSet: { players: { sessionID: sessionID, name: 'guest', points: 0 }}})
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
		Games.update(gameID, { $pull: { players: {sessionID: playerID }}});
	},

	updateUsername: function(newUsername, gameID, sessionID) {
		Games.update(
			{"_id": gameID, 'players.sessionID': sessionID},
			{$set: {'players.$.name': newUsername }}
		)
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

	getRandomWord: function(fileName) {
		var wordList = Assets.getText(fileName);
		var wordList = wordList.split('\n');
		var randNum = Math.floor(Math.random() * wordList.length);
		return wordList[randNum];
	},

	checkGuess: function(guess, roundID) {
		var round = Rounds.find(roundID).fetch()[0];
		if(guess === round.chosenWord){
			var winner = Meteor.call('getSessionID');
			Rounds.update(roundID, { $set: { won: true, winner: winner }});
			Meteor.call('endRound', round.game._id);
		}
	},

	assignPoints: function(gameID) {
		var round = Rounds.findOne({ 'game._id': gameID }, { sort: { 'board.started' : -1 }});
		if(round.won === true) {
			var game = Games.findOne(gameID);
			var drawerPoints = game.timer;
			var guesserPoints = 30;

			console.log(drawerPoints);

			// Update drawer
			Games.update(
				{"_id": gameID, 'players.sessionID': round.drawer.sessionID },
				{$inc: {'players.$.points': drawerPoints }}
			);

			// Update guesser
			Games.update(
				{"_id": gameID, 'players.sessionID': round.winner },
				{$inc: {'players.$.points': guesserPoints }}
			);
		}
	},

	clearLines: function (roundID) {
		Lines.remove({ round_id: roundID });
	}
})

// Used to store current game timers
// TEMP: Shameful hack
var hack = {};

// TEMP: Need to figure out a way to get the gameID to the callback
Meteor.publish("Game", function (gameID) {

	var sessionID = this.connection.id

	this._session.socket.on("close", Meteor.bindEnvironment(function () {

	}, function (e) { console.log(e) })
	);
	return Games.find( gameID );
})
