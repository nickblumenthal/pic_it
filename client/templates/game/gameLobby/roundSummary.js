Template.roundSummary.helpers({
	winner: function() {
    var that = this;
    var game = Games.findOne(
      {_id: Session.get('gameID') },
      {fields: { players: 1},
      reactive: false,
    });

    var winningPlayer = _.find(game.players, function(player) {
      return player.sessionID === that.winner
    });
    return winningPlayer;
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
    return (typeof winner !== "undefined" ? winner.name : "None")
  },

  roundsCount: function() {
    return Rounds.find({'game._id': this._id}).count();
  }, 

  highlightPlayer: function (user) {
    var user = user.hash.user;
    if (typeof user === "undefined") { return };
    return (user.sessionID === Session.get('playerID') ? "currentUser" : "")
  }

});
