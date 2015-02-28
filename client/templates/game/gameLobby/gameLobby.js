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
		var players = this.players.map(function(player){
			return player.name;
		});
		
		return players;
	}
});

Template.gameLobby.events({
	'click #create-round': function (event) {
		var game = this;

		Meteor.call('startCountdown', game, function (error, result) {
		});

		var $btn = $(event.currentTarget)
		// Disable button
		$btn.prop("disabled", true)
		$btn.css("color", "#C4C4C4")

	},

	'click #change-username': function (event) {
		Meteor.call('updateUsername', $('#username').val(), Session.get('gameID'), Session.get('playerID'));
		// Games.update(this._id, {$set: {players[]}})
	}

});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
