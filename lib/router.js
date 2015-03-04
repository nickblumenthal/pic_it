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

		Session.set('gameID', this.params.gameID);
		Session.set('line_id', false)

		this.next();
	},

	waitOn: function () {

		return [Meteor.subscribe("Game", this.params.gameID),
						Meteor.subscribe("Rounds", this.params.gameID)
						]
	},

	data: function () { return Games.findOne( this.params.gameID ) },

	// fastRender: true
});