Games = new Meteor.Collection('Games');

// Server side methods that are called by the client
Meteor.methods({
	createGame: function (gameName) {
		var game = {
			name: gameName,
			// TEMP: Add more stuff later
		};

		var gameID = Games.insert(game);

		return { gameID: gameID };
	}
})

Boards = new Meteor.Collection('Boards');

Lines = new Meteor.Collection('Lines');