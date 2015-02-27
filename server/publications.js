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
	return Rounds.find({ 'game._id': gameID })
})