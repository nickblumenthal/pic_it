		// return Router.current().params.gameID;
Template.gameLobby.helpers({
	creator: function () {
		// TEMP: Might be a session variable for this
		var sessionID = Meteor.default_connection._lastSessionId;
		return ( this.creatorID === sessionID ? true : false )
	}, 

	players: function () {
		return this.players;
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

	}

});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
