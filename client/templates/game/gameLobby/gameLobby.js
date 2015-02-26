		// return Router.current().params.gameID;
Template.gameLobby.helpers({
	creator: function () {
		var sessionID = Meteor.default_connection._lastSessionId;
		return ( this.creatorID === sessionID ? true : false )
	}, 

	inProgress: function () {
		return ( this.status === "waiting" ? true : false)
	},

	players: function () {
		var players = this.players.map(function (sessionID) {
			return { sessionID: sessionID }
		})
		return players;
	}
});

Template.gameLobby.events({
	'click #create-round': function () {
		var game = this;

		Meteor.call('startCountdown', game, function (error, result) {
		});
	}

});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
