Template.home.events({
	'click #create': function (event, template) {
		console.log("Create board");
		// TEMP: Tests for validating the boardName
		var boardName = $('#boardName').val();
		console.log(boardName);

		// Redirect to game lobby
		Router.go('game', { gameID: boardName })
	}
});