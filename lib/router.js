// Sets Iron Router's configuration
Router.configure({
	// Template 'layout' will be used for every page
	layoutTemplate: 'layout',
	loadingTemplate: ""
});

// Iron Router way of defining multiple, simple routes
// TEMP: Current set home to root
// Router.map(function () {
// 	this.route('home', { path: '/' })
// })

Router.route('home', {
	path: '/', 
	subscriptions: function () {
		this.subscribe( 'openGames', 20 ).wait();
		this.subscribe( 'finishedGames', 20 ).wait();
	}
})

Router.route('/guesser', {
	name: 'guesser'
})

Router.route('/:gameID', {
	name: 'game',

	loadingTemplate: "",

	onAfterAction: function () {
		Session.set('gameID', this.params.gameID);
		Session.set('line_id', false)

		var sessionID = Meteor.default_connection._lastSessionId;

		if(sessionID) {
			Meteor.call('joinGame', this.params.gameID, sessionID);
			Session.set('playerID', sessionID);
		}

		Meteor.subscribe("Rounds", this.params.gameID)
	},

	// subscriptions: function () {
	// 	this.wait(Meteor.subscribe("Game", this.params.gameID));
	// },

	waitOn: function () {
		return Meteor.subscribe("Game", this.params.gameID);
	},

	data: function () { return Games.findOne( this.params.gameID ) }
});

// fadeContentIn = function() {
//     $('#main').addClass("animated fadeIn");
// }

// animateContentOut = function() {
//     $('#main').removeClass("animated fadeIn");
// }

// define this as a global onBeforeAction so it happens all the time
// Router.onBeforeAction(function () {
// 	this.next();
// })

// Router.onAfterAction(function () {
// 		// debugger
// 	if (!Session.get('firstHook')) {
// 		console.log("hit after hook")
// 		debugger
// 		$('.hidden').velocity('transition.slideDownBigIn', {
// 			complete: function () {
// 				$('.hidden').removeClass('.hidden')
// 			}
// 		})

// 		Session.set('firstHook', true);
// 	};
// })

// define this as a global onAfterAction so it happens all the time
// Router.onAfterAction(fadeContentIn)