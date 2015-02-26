		// return Router.current().params.gameID;
Template.gameLobby.helpers({

});

Template.gameLobby.events({

});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
