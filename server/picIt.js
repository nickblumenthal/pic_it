Meteor.methods({
	createGame: function (gameName) {
		// Gets the client's session ID
		var creatorID = this.connection.id;
		var createdAt = new Date().getTime();

		var game = {
			name: gameName,
			creatorID: creatorID,
			status: "waiting",
			timer: 0,
			drawer: null,
			players: [],
			createdAt: createdAt
		};

		var gameID = Games.insert(game);

		return { gameID: gameID, creatorID: creatorID };
	},

	startCountdown: function (game) {
		var drawer;

		Meteor.call('selectDrawer', game, function (err, res) {
			drawer = res;
		})

		// Countdown before beginning of round
		Games.update(game._id, { $set: { timer: 5, status: "starting", drawer: drawer }})

		// Incrementing the countdown for pre-round
		var intervalID = Meteor.setInterval( function() {

			Games.update( game._id, { $inc: { timer: -1 }})
			var Game = Games.findOne( game._id )

			if (Game.timer == 0) {
				Meteor.clearInterval( intervalID )
				Meteor.call('startGame', Game, drawer);
			};
			}, 1000)

		return drawer;
	},

	selectDrawer: function (game) {
		var players = game.players;

		// Assign a random drawer
		var drawerNum = Math.floor(Math.random()*players.length);
		var drawer = players[drawerNum];

		return drawer;
	},

	createRound: function (game, drawer) {
		var createdAt = new Date().getTime();

		// Chose a random word
		var chosenWord = Meteor.call('getRandomWord', 'wordlist1.txt');

		var round = {
			game: game,
			createdAt: createdAt,
			drawer: drawer,
			board: {
				createdAt: createdAt,
				updated: createdAt
			},
			lines: {},
			guessedWords: [],
			chosenWord: chosenWord,
			won: false
		}

		var roundID = Rounds.insert( round );

		var round = Rounds.findOne( roundID, { sort: { 'createdAt' : -1 }});

		return round;
	},

	startGame: function (game, drawer) {
		var gameID = game._id;

		Meteor.call( 'createRound', game, drawer )

		Games.update( gameID, { $set: { status: "inProgress", timer: 60 }});

		// Incrementing the countdown for pre-round
		var intID = Meteor.setInterval( function() {

			Games.update( game._id, { $inc: { timer: -1 }})
			var Game = Games.findOne( game._id )

			if (Game.timer <= 0) { Meteor.call( 'endRound', gameID )}
		  }, 1000)

		hack[gameID] = intID;

	},

	endRound: function (gameID) {
		Meteor.call('assignPoints', gameID);
		// TEMP: Part of the hack
		Meteor.clearInterval( hack[gameID] )
		delete hack[gameID]

		// Count the number of rounds
		var count = Rounds.find({ 'game._id': gameID }).count()

		if (count >= 4) {
			Meteor.call('endGame', gameID)
		} else {
			Games.update( gameID, { $set: { status: "waiting", timer: 0 }})
		}
	},

	endGame: function (gameID) {
		Meteor.call('getGameWinner', gameID, function (err, res) {
			var winner = res;

			Games.update( gameID, { $set: { status: "finished", timer: 0, winner: winner }})
		})
	},

	joinGame: function (gameID, sessionID) {
		// Not worth the db call to find the number of current players
		var userNum = Math.floor((Math.random() * 100) + 1);
		var username = "Guest" + userNum;
		Games.update(gameID, { $addToSet: { players: { sessionID: sessionID, name: username, points: 0 }}})
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

	removeUser: function (playerID, gameID) {
		Games.update(gameID, { $pull: { players: {sessionID: playerID }}});
	},

	updateUsername: function(newUsername, gameID, sessionID) {
		Games.update(
			{"_id": gameID, 'players.sessionID': sessionID},
			{$set: {'players.$.name': newUsername }}
		)
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
		var round = Rounds.findOne(roundID);
		if(guess === round.chosenWord){
			// Winner should be refactored to be the entire player object
			var winner = this.connection.id;
			Rounds.update(roundID, { $set: { won: true, winner: winner }});
			Meteor.call('endRound', round.game._id);
		} else if (round.guessedWords.indexOf(guess) === -1) {
			guesses = round.guessedWords;
			guesses.unshift(guess);
			Rounds.update(
				{"_id": roundID},
				{
					$set: {
						guessedWords: guesses
					}
				}
			);
		}
	},

	assignPoints: function(gameID) {
		var round = Rounds.findOne({ 'game._id': gameID }, { sort: { 'createdAt' : -1 }});
		if(round.won === true) {
			var game = Games.findOne(gameID);
			var drawerPoints = game.timer;
			var guesserPoints = 30;

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

	getGameWinner: function(gameID) {
		var game = Games.findOne(gameID);
		players = game.players;
		players = players.sort(function(p1, p2) { p2.point - p1.points });

		return players[0];
	},

	clearLines: function (roundID) {
		Lines.remove({ round_id: roundID });
	}
})

// Used to store current game timers
// TEMP: Shameful hack
var hack = {};
