		// return Router.current().params.gameID;
Template.gameLobby.helpers({
	creator: function () {
		// TEMP: Might be a session variable for this
		var sessionID = Meteor.default_connection._lastSessionId;
		return ( this.creatorID === sessionID ? true : false )
	},

	players: function () {
		return _.sortBy( this.players, 'points' ).reverse();
	},

	rounds: function() {
		return Rounds.find({'game._id': this._id});
	},

	roundsCount: function() {
		return Rounds.find({'game._id': this._id}).count();
	}
});

Template.gameLobby.events({
	'click #change-username': function (event) {
		Meteor.call('updateUsername', $('#username').val(), Session.get('gameID'), Session.get('playerID'));
		// Games.update(this._id, {$set: {players[]}})
	}

});


Template.gameLobby.rendered = function() {

  var reactiveList = this.$('.animated');

	// Initial anim of players list
	reactiveList.children().velocity('transition.slideLeftIn',
		{ stagger: 250 }
	)

};

// TEMP: Might want to refactor this into the overall game template
window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
