getCurrentRound = function(gameID) {
  return Rounds.findOne({ 'game._id': gameID }, { sort: { 'board.started' : -1 }});
}
