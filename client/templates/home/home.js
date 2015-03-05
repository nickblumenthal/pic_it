Template.home.events({
	'click #create': function (event, tmp) {
		createGame(tmp)
	}, 

	'keypress #gameName': function (event, tmp) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
	  if(keycode == '13'){
	  	createGame(tmp);
    }
	}
});

Template.home.rendered = function () {
	Session.set('notFirstHook', true)
};

var createGame = function (tmp) {
	var gameName = this.$('#gameName').val();
	console.log("Create Game: " + gameName);

	if (!validName(gameName)) {
		// Give an error 
		return;
	}

	Meteor.call('createGame', gameName, function (error, result) {
		if (error) { console.log(error) };

		if (result) {
			// Redirect to game lobby
			Router.go('game', { gameID: result.gameID })
		};
	});
}

var validName = function (gameName) {
	var gameName = $.trim(gameName)

	return ( gameName === "" ? false : true )
}