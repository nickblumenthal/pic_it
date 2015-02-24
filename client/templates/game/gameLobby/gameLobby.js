		// return Router.current().params.gameID;
Template.gameLobby.helpers({
	
});

Template.gameLobby.events({
	'click #create-round': function () {
		var game = this;

		Meteor.call('createRound', game, function (error, result) {
			//TEMP: Remove

			if (result) {
				$('#temp').append("<p>Board id: " + result._id + "</p>")
			};
		});
	}
});


