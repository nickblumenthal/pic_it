// Sets Iron Router's configuration
Router.configure({
	// Template 'layout' will be used for every page
	layoutTemplate: 'layout',
	// Hack- Loading template is empty
	loadingTemplate: 'loading'
});


Router.route('home', {
	path: '/', 

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
		console.log(sessionID)

		if(sessionID) {
			Meteor.call('joinGame', this.params.gameID, sessionID, function () {	
			});
			Session.set('playerID', sessionID);
		} else {
			console.log('ERROR- User not logged in!')
		}	


		this.next();
	},

	waitOn: function () {

		return Meteor.subscribe("Game", this.params.gameID);
	},

	data: function () { return Games.findOne( this.params.gameID ) },

	// fastRender: true
});