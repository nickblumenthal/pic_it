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

	getSessionID: function () {
		//TEMP: find by user session
		return Meteor.default_connection._lastSessionId;
		// Meteor.call('getSessionID', function (error, id) {
		// 	console.log(id)
		// 	return id
		// });
	}
});

Template.game.events({
	'click button': function () {
		if (Session.get('gameStatus') === "waiting") {
			Session.set('gameStatus', 'inProgress')
		} else {
			Session.set('gameStatus', 'waiting');
		}

		Meteor.call('createRound', this, function (error, result) {
			console.log(result)
		});

	}
});