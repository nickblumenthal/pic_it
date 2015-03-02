Template.guessList.helpers({
  guessedWords: function() {
    return getCurrentRound(this._id).guessedWords;
  }
})
