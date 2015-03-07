Games = new Mongo.Collection('Games');
// {
// 	gameId: "abcd",
// 	gameName: "name",
// 	creatorId: { userObject }
//  players: [
//    {sessionID: '1234sdfljk', name: 'nick', points: 0}
//  ]
// }

// Server side methods that are called by the client

Rounds = new Mongo.Collection("Rounds");
// {
// 	roundId: "abcd",
//  gameId: "bvsa",
// 	game: { gameObject },
// 	board: { boardObject },
// 	lines: { linesObject },
//  won: false,
//  
// }

// On second thought, we probably don't need an entire boards collection
// we are probably fine with embedding the board into the round entry


// Boards = new Mongo.Collection('Boards');

Lines = new Mongo.Collection('Lines');
