getCurrentRound = function(gameID) {
  return Rounds.findOne({ 'game._id': gameID }, { sort: { 'board.started' : -1 }});
}

Template.registerHelper('rounds', function () {
	var gameID = this._id
	if (this.status === "waiting") {};
	return Rounds.find({ 'game._id': gameID })
})