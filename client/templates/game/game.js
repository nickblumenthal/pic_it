Session.set('gameStatus', "waiting");

Template.game.helpers({
	getTemplate: function () {
		if ( Session.get('gameStatus') === "waiting") {
			return 'gameLobby'
		} else {
			return 'board'
		}
	}, 

	gameStatus: function () {
		return Session.get('gameStatus');
	},

	session: function () {
		//TEMP: find by user session
		return Meteor.default_connection._lastSessionId;
	}
});

Template.game.events({
	'click button': function () {
		if (Session.get('gameStatus') === "waiting") {
			Session.set('gameStatus', 'inProgress')
		} else {
			Session.set('gameStatus', 'waiting');
		}
	}
});