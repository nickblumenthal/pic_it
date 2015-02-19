Template.home.events({
	'click #create': function (event, template) {
		
		// TEMP: Add tests for validating the gameName
		var gameName = $('#gameName').val();
		console.log("Create Game: " + gameName);

		// Meteor/Mongo call to create the game, server side method
		// 
		Meteor.call('createGame', gameName, function (error, result) {

			if (error) { console.log(error) };

			if (result) {

				// Redirect to game lobby
				Router.go('game', { gameID: result.gameID })
			};
		});
	}
});