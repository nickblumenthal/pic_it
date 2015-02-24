		// return Router.current().params.gameID;
Template.gameLobby.helpers({

});

Template.gameLobby.events({
	'click #create-round': function () {
		var game = this;

		Meteor.call('createRound', game, function (error, result) {
			if (result) {
				Session.set('currentRound', result._id);
			};
		});
	}
});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
