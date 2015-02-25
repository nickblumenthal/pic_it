		// return Router.current().params.gameID;
Template.gameLobby.helpers({

});

Template.gameLobby.events({
	'click #create-round': function () {
		var game = this;

		
	}
});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
