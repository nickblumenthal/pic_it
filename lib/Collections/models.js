Games = new Meteor.Collection('Games');
// {
// 	gameId: "abcd",
// 	gameName: "name",
// 	creatorId: { userObject }
// }

// Server side methods that are called by the client

Rounds = new Meteor.Collection("Rounds");
// {
// 	roundId: "abcd",
//  gameId: "bvsa",
// 	game: { gameObject },
// 	board: { boardObject },
// 	lines: { linesObject }
// }

// On second thought, we probably don't need an entire boards collection
// we are probably fine with embedding the board into the round entry


// Boards = new Meteor.Collection('Boards');

Lines = new Meteor.Collection('Lines');


