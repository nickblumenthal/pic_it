Games = new Meteor.Collection('Games');
// {
// 	gameId: "abcd",
// 	gameName: "name",
// 	creatorId: { userObject }
// }

// Server side methods that are called by the client

Rounds = new Meteor.Collection("Rouds");
// {
// 	roundId: "abcd",
// 	game: { gameObject },
// 	board: { boardObject },
// 	lines: { linesObject }
// }

// On second thought, we probably don't need an entire boards collection
// we are probably fine with embedding the board into the round entry
// Boards = new Meteor.Collection('Boards');

// Lines = new Meteor.Collection('Lines');




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
		var round = {
			game: game,
			board: {},
			lines: {}
		}

		var roundID = Rounds.insert( round );
		var round = Rounds.findOne( roundID );

		return round;
	},

	getSessionID: function () {
		console.log(this.connection.id)
		return this.connection.id;
	}
})