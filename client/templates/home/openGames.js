Template.openGames.helpers({
	openGames: function () {
		var limit = screen.width < 600 ? 8 : 20;
		return Games.find({ status: { $ne: "finished" }}, {
			sort: { createdAt: -1 },
			limit: 20,
			fields: { name: 1 }
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

	ready: function () {
		return _.all( Template.instance().subscriptions, function (sub, key) {
			return sub.ready()
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

  // Save subs into the template instance
  var tempSubs = this.subscriptions = {};

  Tracker.autorun(function() {
		tempSubs.openGames = Meteor.subscribe('openGames', Session.get('openGamesCursor'));
		tempSubs.finishedGames = Meteor.subscribe('finishedGames', Session.get('finishedGamesCursor'));
  });

}


// Terminates subs
Template.openGames.destroyed = function () {
	_.each( this.subscriptions, function (sub) {
		sub.stop();
	})
};


var incrementCursor = function (cursor, inc) {
  var newCursor = Session.get( cursor ) + inc;
  Session.set( cursor, newCursor);
}
