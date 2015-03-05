// Publishes for home page
Meteor.publish("openGames", function (cursor) {
	return Games.find({ status: { $ne: "finished"}}, {
		limit: 20,
		skip: cursor,
		sort: {
			createdAt: -1
		}
	})
})

Meteor.publish("finishedGames", function (cursor) {
	return Games.find({ status: "finished" }, {
		limit: 20,
		skip: cursor,
		sort: {
			createdAt: -1
		}
	})
})

// Iron Router Sub hooks
// Publish for individual game
Meteor.publish("Game", function (gameID) {
	return Games.find( gameID );
})

Meteor.publish("Rounds", function (gameID) {
	onSocketClose(this, gameID)

	return Rounds.find({ 'game._id': gameID })
})

Meteor.publish("Lines", function (roundID) {
	return Lines.find({ 'round_id': roundID })
})

// Server precaution to remove users from game if disconnected
var onSocketClose = function (session, gameID) {
	var sessionID = session.connection.id

	session._session.socket.on("close", Meteor.bindEnvironment( function (e) {
		var game = Games.findOne({_id: gameID}, {
			fields: { status: 1 },
			reactive: false
		})
		if (game.status !== "finished") {
			Meteor.call('removeUser', sessionID, gameID)
		};
	}))
}