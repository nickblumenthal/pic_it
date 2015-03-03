Template.guessList.helpers({
  guessedWords: function() {
    return getCurrentRound(this._id).guessedWords.slice(0,11);
  }
})
