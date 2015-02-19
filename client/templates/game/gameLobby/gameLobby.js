Template.gameLobby.helpers({
	gameID: function () {
		// TEMP: Might be a better way to do this
		// when route calls mongo try 'this.params.query'
		return Router.current().params.gameID;
	}
});

Template.gameLobby.events({
	'click button': function (event, template) {

	}
});