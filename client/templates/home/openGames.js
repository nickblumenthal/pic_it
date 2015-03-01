Template.openGames.helpers({
	openGames: function () {
		return Games.find({ status: { $ne: "finished" }}, {
			sort: { createdAt: -1 },
			limit: 20
		})
	},

	openGamesCount: function () {
		return Games.find({ status: { $ne: "finished" }}, {
			sort: { createdAt: -1 },
			limit: 20
		}).count()
	},

	finishedGames: function () {
		return Games.find({ status: "finished" }, {
			sort: { createdAt: -1 },
			limit: 20
		})
	},

	finishedGamesCount: function() {
		return Games.find({ status: "finished" }, {
			sort: { createdAt: -1 },
			limit: 20
		}).count()
	}
});

Template.openGames.events({
	'click .open-game': function (event) {
		var gameID = event.currentTarget.dataset.id;
		Router.go('game', { gameID: gameID })
	},

	'click #open-game-next': function (event, template) {
		incrementCursor( 'openGamesCursor', 20 )
	},

	'click #open-game-prev': function (event, template) {
		if ( Session.get('openGamesCursor') > 0 ) {
			incrementCursor( 'openGamesCursor', -20 )
		};
	},

	'click #finished-games-next': function (event, template) {
		incrementCursor( 'finishedGamesCursor', 20 )
	},

	'click #finished-games-prev': function (event, template) {
		if ( Session.get('finishedGamesCursor') > 0 ) {
			incrementCursor( 'finishedGamesCursor', -20 )
		};
	}
});


Template.openGames.created = function() {
  Session.setDefault('openGamesCursor', 0);
  Session.setDefault('finishedGamesCursor', 0);

  Tracker.autorun(function() {
    Meteor.subscribe('openGames', Session.get('openGamesCursor'));
    Meteor.subscribe('finishedGames', Session.get('finishedGamesCursor'));
  });
}

Template.openGames.rendered = function () {

	// You can select all after render as this.$('*')
	// Won't work because its rendered and then hidden
}


var incrementCursor = function (cursor, inc) {
  var newCursor = Session.get( cursor ) + inc;
  Session.set( cursor, newCursor);
}
