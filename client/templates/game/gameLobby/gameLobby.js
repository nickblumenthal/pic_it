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
	}
});


Template.gameLobby.rendered = function() {

  var dbPlayers = this.$('.current-players');

	// Initial anim of players list
	dbPlayers.children().velocity('transition.slideLeftIn',
		{ stagger: 250 }
	)

	observeCurrentUser(this)

	// Animation for gameLobby 
	observeDrawer(this);

	// To prevent users from being removed from game after its over
	if ( this.data.status === "finished" ) {
		window.onbeforeunload = null;
	};
};

// TEMP: Might want to refactor this into the overall game template
window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}

var query;
var observeCurrentUser = function (tmp) {
	var game = Games.find({ _id: tmp.data._id});

	query = game.observeChanges({
		changed: function (id, fields) {
			if (fields.players) {
				console.log(fields.players)
				var currentUser = _.find( fields.players, function (player) {
					return player.sessionID === Session.get('playerID');
				})
				if (currentUser) { 
					Meteor.setTimeout( function() {
						highlightCurrentUser(currentUser.sessionID)
					}, 200)
				}
			};
		},
	});
}

var highlightCurrentUser = function (sessionID) {
	// Stops the observe changes
	query.stop();
	var currentPlayer = $('.current-players').find('li[data-id="' + sessionID + '"]')
	currentPlayer.addClass('currentUser');
}

var observeDrawer = function (tmp) {
	var game = Games.find({ _id: tmp.data._id});

	game.observeChanges({
		changed: function (id, fields) {
			if (fields.drawer) {
				revealDrawer(fields.drawer, tmp)
			};
		}
	});
}

var revealDrawer = function (drawer, tmp) {
	var drawerID = drawer.sessionID;
	var list = tmp.$('.current-players').find('li');
	var $drawer;

	// Searches for the list of current users and creates a list of guessers
	// as well as isolating the drawer
	var guessers = $.grep(list, function(value) { 
		var $value = $(value);
		if ( $value.data("id") === drawerID ) {
			$drawer = $value;
		}; 
		return $value.data("id") !== drawerID 
	})

	$drawer.velocity({
		translateX: ["-20px", "easeOutCubic"],
		colorGreen: "90%"
	}, 2000)

	$(guessers).velocity({
		opacity: [".25", "easeOutSine"]
	}, 5000)
}