Template.game.helpers({
	// Used to dynamically switch the template partial based
	// on what the status of the game is.
	getTemplate: function () {

		if ( this.status === 'inProgress') {
			assignRoles(this._id);
			if(Session.get('role') === 'drawer') {
				return 'drawer'
			} else {
				return 'guesser'
			}
		} else {
			return 'gameLobby'
		}
	},

	// Gives the partial templates data
	getDataContext: function () {
		var gameID = this._id;
		if ( this.status === "inProgress") {
			return getCurrentRound(gameID);
		} else {
			return this;
		}
	},

	// TEMP: Switch to mongoquery. Update: maybe not- ('this' is reactive)
	gameStatus: function () {
		return this.status;
	},

	inLobby: function () {
		return ( this.status === "waiting" ? true : false ) 
	},

	getSessionID: function () {
		return Session.get('playerID');
	},

	getRoundID: function () {
		var round;
		if(round = getCurrentRound(Session.get('gameID'))) {
			return round._id;
		} else {
			return 'Waiting to start round.'
		}
	},

	roundNum: function () {
		return Rounds.find({ 'game._id': this._id }).count()
	},

	nextRoundNum: function () {
		return Rounds.find({ 'game._id': this._id }).count()
	}
});



Template.game.events({
	'click #home': function (event) {
		Meteor.call('removeUser', Session.get('playerID'), this._id);
		Router.go('home');
	}
});



Template.game.rendered = function () {

	var game = this.data;

	// Create FlipClock.js element
	clock = new FlipClock($('#countdown'), {
		clockFace: 'Counter',
		autoStart: false,
		countdown: true
	})

	// Sets clock to whatever the current game timer is
	clock.setTime(game.timer)

	// Reactively observing timer changes of the mongo entry
	// Only updates the counter if the change is for the timer
	Games.find( game._id ).observeChanges({
		changed: function (id, fields) {
			if (fields.timer != null) {
				clock.setTime(fields.timer)
			};
		}
	});
};



var updateClock = function (clock, time) {
	clock.setTime( time )
}

var assignRoles = function(gameID) {
	var round = getCurrentRound(gameID);
	if(round.drawer === Session.get('playerID')) {
		Session.set('role', 'drawer');
	} else {
		Session.set('role', 'guesser');
	}
};
