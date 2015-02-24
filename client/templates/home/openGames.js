Template.openGames.helpers({
	openGames: function () {
		return Games.find({ $or: [ { status: "inProgress" }, { status: "waiting" }]})
	}
});

Template.openGames.events({
	'click .open-game': function (event) {
		var gameID = event.currentTarget.dataset.id;
		Router.go('game', { gameID: gameID })
	}
});