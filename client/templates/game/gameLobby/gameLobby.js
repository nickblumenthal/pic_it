		// return Router.current().params.gameID;
Template.gameLobby.helpers({

});

Template.gameLobby.events({
	'click #create-round': function () {
		var game = this;

		// Create coutdown if Round creation successful
		var clock = new FlipClock($('#countdown'), 5, {
			clockFace: 'Counter',
			autoStart: true,
			countdown: true,
			callbacks: {
				stop: function () {
					Meteor.call('createRound', game, function (error, result) {
						if (result) {
							Session.set('currentRound', result._id);
						};
					});
				}
			}
		})
	}
});

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
