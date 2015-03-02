Template.roundSummary.helpers({
	winner: function() {
    var that = this;
    var winningPlayer = this.game.players.filter(function(player) {
      return player.sessionID === that.winner
    });
    if(winningPlayer.length > 0) {
		  return winningPlayer[0].name;
    } else {
      return 'None';
    }
	}
});
