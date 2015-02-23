Meteor.methods({
	createGame: function (gameName) {
		var game = {
			name: gameName,
			// TEMP: Add more stuff later
		};

		var gameID = Games.insert(game);

		return { gameID: gameID };
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

	boardUpdated: function (roundID) {
		var now = new Date().getTime();

		Rounds.update({ _id: roundID }, { $set: { 'board.updated': now }})

		return "working"
	},


	getSessionID: function () {
		console.log(this.connection.id)
		return this.connection.id;
	},

	loadWordList: function(fileName) {

	  var wordList = Assets.getText('nounlist.txt');
	  var wordList = wordList.split('\n');
		console.log('wordList');
	  return wordList;
	}
})
