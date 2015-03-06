Template.roundSummary.helpers({
	winner: function() {
    var that = this;
    var winningPlayer = this.game.players.filter(function(player) {
      return player.sessionID === that.winner
    });
    if(winningPlayer.length > 0) {
		  return winningPlayer[0];
    } else {
      return '';
    }
	},

  rounds: function() {
    return Rounds.find({'game._id': this._id}, {
      sort: { createdAt: -1 }, 
      fields: {
        drawer: 1, 
        chosenWord: 1,
        winner: 1,
        'game.players': 1
      }
    });
  },

  winnerName: function (user) {
    var winner = user.hash.user;
    if (winner.name) {
      return winner.name
    } else {
      return "None"
    }
  },

  roundsCount: function() {
    return Rounds.find({'game._id': this._id}).count();
  }, 

  highlightPlayer: function (user) {
    var user = user.hash.user;
    return (user.sessionID === Session.get('playerID') ? "currentUser" : "")
  }

});
