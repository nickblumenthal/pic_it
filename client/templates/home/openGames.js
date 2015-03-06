Template.openGames.helpers({
	openGames: function () {
		return Games.find({ status: { $ne: "finished" }}, {
			sort: { createdAt: -1 },
			limit: Session.get('numOfGames'),
			fields: { name: 1 }
		})
	},

	openGamesCount: function () {
		return Games.find({ status: { $ne: "finished" }}, {
			sort: { createdAt: -1 },
			limit: Session.get('numOfGames')
		}).count()
	},

	finishedGames: function () {
		return Games.find({ status: "finished" }, {
			sort: { createdAt: -1 },
			limit: Session.get('numOfGames')
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
			limit: Session.get('numOfGames')
		}).count()
	},

	// TEMP: DRY it
	disableBtn: function (dir) {
		var dir = dir.hash.dir;
		if (dir === "next") {
			return ( openGamesCounter() < Session.get('numOfGames') ? "disabled" : "" )
		} else {
			return (Session.get('openGamesCursor') <= 0 ? "disabled" : "") 
		}
	},

	disabledBtnClass: function (dir) {
		var dir = dir.hash.dir;
		if (dir === "next") {
			return ( openGamesCounter() < Session.get('numOfGames') ? "disable-btn" : "" )
		} else {
			return (Session.get('openGamesCursor') <= 0 ? "disable-btn" : "") 
		}
	}
});

Template.openGames.events({
	'click .open-game': function (event) {
		var gameID = event.currentTarget.dataset.id;
		Router.go('game', { gameID: gameID })
	},

	'click #open-game-next': function (event, template) {
		incrementCursor( 'openGamesCursor', Session.get('numOfGames') )
	},

	'click #open-game-prev': function (event, template) {
		var openGamesCursor = Session.get('openGamesCursor');
		if ( openGamesCursor <= 8 && openGamesCursor > 1 ) {
			Session.set('openGamesCursor', 0);
		} else if ( openGamesCursor > 0 ) {
			incrementCursor( 'openGamesCursor', ( -1 * Session.get('numOfGames') ))
		}
	},

	'click #finished-games-next': function (event, template) {
		incrementCursor( 'finishedGamesCursor', Session.get('numOfGames') )
	},

	'click #finished-games-prev': function (event, template) {
		if ( Session.get('finishedGamesCursor') > 0 ) {
			incrementCursor( 'finishedGamesCursor', (-1 * Session.get('numOfGames')) )
		};
	}
});


Template.openGames.created = function() {
	// Reactive elements to change the number of open games to display
	var initialNumOfGames = $(window).width() < 600 ? 8 : 20;
	Session.setDefault('numOfGames', initialNumOfGames);
	resizeObserver();

  Session.setDefault('openGamesCursor', 0);
  Session.setDefault('finishedGamesCursor', 0);

  // Save subs into the template instance
  var tempSubs = this.subscriptions = {};

  Tracker.autorun(function() {
		tempSubs.openGames = Meteor.subscribe('openGames', Session.get('openGamesCursor'));
		// tempSubs.finishedGames = Meteor.subscribe('finishedGames', Session.get('finishedGamesCursor'));
  });
}


// Terminates subs
Template.openGames.destroyed = function () {
	_.each( this.subscriptions, function (sub) {
		sub.stop();
	})

	// Removes resizeObserver
	$(window).off('resize');
};

var resizeObserver = function () {
	$(window).resize(function () {
		var size = $(window).width();
		if (size < 600) {
			setWidth(8)
		} else {
			setWidth(20)
		}
	})
}

var setWidth = function (numOfGames) {
	var currentNumOfGames = Session.get('numOfGames');

	if ( currentNumOfGames !== numOfGames) {
		Session.set('numOfGames', numOfGames)
	};
}

var incrementCursor = function (cursor, inc) {
  var newCursor = Session.get( cursor ) + inc;
  Session.set( cursor, newCursor);
}

var openGamesCounter = function () {
	return Games.find({ status: { $ne: "finished" }}).count()
}
