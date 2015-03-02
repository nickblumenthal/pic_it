Template.guessList.helpers({
  guessedWords: function() {
    return Rounds.findOne({'game._id': this._id}).guessedWords;
  }
})
