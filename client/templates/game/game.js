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
		return ( this.status === "waiting" ? true : false );
	},

	inLobbyOrStarting: function () {
		return ( (this.status === "waiting" || this.status === "starting") ? true : false);
	},

	gameFinished: function () {
		return ( this.status == "finished" ? true: false );
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
	},

	getUsername: function() {
		var player = this.players.filter(function(player) {
			return player.sessionID === Session.get('playerID')
		});
		return player.name || 'Guest';
	}
});



Template.game.events({
	'click #create-round': function (event) {
		var game = this;

		Meteor.call('startCountdown', game, function (error, result) {
		});
	},

	'click #home': function (event) {
		Meteor.call('removeUser', Session.get('playerID'), this._id);

		// Kill observers:
		Games.stopClockObserve( );
		// Defined in board.js
		Rounds.stopLinesObserver();

		Router.go('home');
	},

	'keyup #username': function (event) {
		Meteor.call('updateUsername', $('#username').val(), Session.get('gameID'), Session.get('playerID'));
		// Games.update(this._id, {$set: {players[]}})
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

	// Reactively observing timer changes of the specific game entry
	Games.startClockObserve(clock, game._id)
};

// TEMP: Not sure if this allowed, but had to save the observer
// in order to access it from the events

Games.startClockObserve = function startClockObserve(clock, gameID) {
	Games.clockObserver =  Tracker.autorun(function () {
		try {
			var Game = Games.findOne( gameID );
			Tracker.nonreactive( updateClock( clock, Game.timer ))
		} catch (e) {}
	})
}

Games.stopClockObserve = function stopClockObserve () {
	if ( Games.clockObserver ) {
		Games.clockObserver.stop();
	};
}

// Games.startClockObserve = function startClockObserve(gameID) {
// 	Games.clockObserver = 	Games.find( gameID ).observeChanges({
// 		changed: function (id, fields) {
// 			if (fields.timer != null) {
// 				clock.setTime(fields.timer)
// 			};
// 		}
// 	});
// }

// Games.stopClockObserve = function stopClockObserve () {
// 	if ( Games.clockObserver ) {
// 		Games.clockObserver.stop();
// 	};
// }



var updateClock = function (clock, time) {
	clock.setTime( time )
}

var assignRoles = function(gameID) {
	var round = getCurrentRound(gameID);
	if(round.drawer.sessionID === Session.get('playerID')) {
		Session.set('role', 'drawer');
	} else {
		Session.set('role', 'guesser');
	}
};
