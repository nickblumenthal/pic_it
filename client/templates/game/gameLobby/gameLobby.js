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

	highlightPlayer: function () {
		return (this.sessionID === Session.get('playerID') ? "currentUser" : "")
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

	// Animation for when the drawer is chosen
	observeDrawer(this);

	// To prevent users from being removed from game after its over
	if ( this.data.status === "finished" ) {
		window.onbeforeunload = null;
	};
};

Template.gameLobby.destroyed = function () {
	if (drawerQuery) { drawerQuery.stop()};
};

// TEMP: Might want to refactor this into the overall game template
window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}


var drawerQuery;
var observeDrawer = function (tmp) {
	var game = Games.find({ _id: tmp.data._id});

	drawerQuery = game.observeChanges({
		changed: function (id, fields) {

			if (fields.status === "starting") {
				var query = Games.findOne( {_id: tmp.data._id}, {
					fields: { drawer: 1 },
					reactive: false
				});
				
				revealDrawer(query.drawer.sessionID, tmp)
			};
		}
	});
}

var revealDrawer = function (sessionID, tmp) {
	if (drawerQuery) {
		drawerQuery.stop();
	};

	var drawerID = sessionID;
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