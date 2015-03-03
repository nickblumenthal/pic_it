// Sets Iron Router's configuration
Router.configure({
	// Template 'layout' will be used for every page
	layoutTemplate: 'layout',
	// Hack- Loading template is empty
	loadingTemplate: 'loading'
});


Router.route('home', {
	path: '/', 
	// subscriptions: function () {
	// 	// debugger
	// 	var num;
	// 	if (Meteor.isClient) {
	// 		num = Session.get('openGamesCursor');
	// 	};
	// 	return Meteor.subscribe( 'openGames', num );
	// 	// this.wait(Meteor.subscribe( 'finishedGames', 20 ));
	// },

	fastRender: true,
})

Router.route('/guesser', {
	name: 'guesser'
})

Router.route('/:gameID', {
	name: 'game',

	onBeforeAction: function () {
		Meteor.subscribe("Rounds", this.params.gameID)
		Session.set('gameID', this.params.gameID);
		Session.set('line_id', false)

		var sessionID = Meteor.default_connection._lastSessionId;

		if(sessionID) {
			Meteor.call('joinGame', this.params.gameID, sessionID);
			Session.set('playerID', sessionID);
		}
		this.next();
	},

	onAfterAction: function () {

	},

	// subscriptions: function () {
	// 	this.wait(Meteor.subscribe("Game", this.params.gameID));
	// },

	waitOn: function () {
		return Meteor.subscribe("Game", this.params.gameID);
	},

	data: function () { return Games.findOne( this.params.gameID ) },

	// fastRender: true
});