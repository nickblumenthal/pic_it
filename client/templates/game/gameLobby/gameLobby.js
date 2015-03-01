		// return Router.current().params.gameID;
Template.gameLobby.helpers({
	creator: function () {
		// TEMP: Might be a session variable for this
		var sessionID = Meteor.default_connection._lastSessionId;
		return ( this.creatorID === sessionID ? true : false )
	},

	players: function () {
		return this.players;
	},

	disableBtn: function () {
		if ( this.status === "starting" ) { return "disabled" };
	},

	disabledBtnClass: function () {
		return (this.status === "starting" ? "disable-btn" : "" )
	}
});

Template.gameLobby.events({
	'click #create-round': function (event) {
		var game = this;

		Meteor.call('startCountdown', game, function (error, result) {
		});
	},

	'click #change-username': function (event) {
		Meteor.call('updateUsername', $('#username').val(), Session.get('gameID'), Session.get('playerID'));
		// Games.update(this._id, {$set: {players[]}})
	}

});


// IMPORTANT: Meteor looks at a reactive element's parent for a property
// _uihooks to see what to do before inserting, moving or deleting the 
// reactive element

Template.gameLobby.rendered = function() {
  this.$('.animated')[0]._uihooks = {
    insertElement: function(node, next) {
      $(node).insertBefore(next);
      return Tracker.afterFlush(function() {
      	$(node).velocity('transition.slideLeftIn')
      });
    },

		removeElement: function(node) {
			// Need this for CSS transitions
	    // var finishEvent;
	    // finishEvent = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

	    // return $(node).on(finishEvent, function() {
	    //   return $(node).remove();
	    // });


    	$(node).velocity('transition.slideRightOut', function () {
    		$(node).remove()
    	})
	  }
  };
};

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
