// Sets Iron Router's configuration
Router.configure({
	// Template 'layout' will be used for every page
	layoutTemplate: 'layout'
});


// Iron Router way of defining multiple, simple routes
// TEMP: Current set home to root
Router.map(function () {
	this.route('home', { path: '/' })
})

Router.route('/:gameID', {
	name: 'game',

	onAfterAction: function () {
		Session.set('gameID', this.params.gameID);
		Session.set('line_id', false)
		Session.set('role', 'guesser')

		var sessionID = Meteor.default_connection._lastSessionId;

		Meteor.call('joinGame', this.params.gameID, sessionID);
		Meteor.subscribe('Games');
	},
	
	waitOne: function () {
		return Meteor.subscribe("Games");
	},

	data: function () { return Games.findOne( this.params.gameID ) }
})

// Iron Router way of defining more complex routes that require data
// Router.route('/notSureYet/:_id', {
// 	name: 'templateName',
// 	data: function () {return Game.findOne( this.params._id )}
// })

