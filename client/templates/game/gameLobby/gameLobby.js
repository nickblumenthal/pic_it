		// return Router.current().params.gameID;
Template.gameLobby.helpers({
	creator: function () {
		// TEMP: Might be a session variable for this
		var sessionID = Meteor.default_connection._lastSessionId;
		return ( this.creatorID === sessionID ? true : false )
	},

	players: function () {
		return _.sortBy( this.players, 'points' ).reverse();
	},

	rounds: function() {
		return Rounds.find({'game._id': this._id});
	},

	roundsCount: function() {
		return Rounds.find({'game._id': this._id}).count();
	}
});

Template.gameLobby.events({
	'click #change-username': function (event) {
		Meteor.call('updateUsername', $('#username').val(), Session.get('gameID'), Session.get('playerID'));
		// Games.update(this._id, {$set: {players[]}})
	}

});

Template.gameLobby.created = function () {
}


// IMPORTANT: Meteor looks at a reactive element's parent for a property
// _uihooks to see what to do before inserting, moving or deleting the
// reactive element

// Need to refactor this
Template.gameLobby.rendered = function() {

  var reactiveList = this.$('.animated');

	// Animated players list
	reactiveList.children().velocity('transition.slideLeftIn',
		{ stagger: 250 }
	)
  // Adds animations to reactive elements inside of .animated
  createElementHooks( reactiveList );

};

var createElementHooks = function ($obj) {
	// TEMP: Can iterate if multiple items
	$obj[0]._uihooks = {

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

			var $node = $(node);

    	$node.velocity('transition.slideRightOut', function () {
    		$node.remove()
    	})
	  }
  };
}

window.onbeforeunload = function(){
	Meteor.call('removeUser', Session.get('playerID'), Session.get('gameID'));
}
