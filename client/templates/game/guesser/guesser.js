var guessedWords = new ReactiveArray();

Template.guesser.events({
	'keyup #guess': function (event, template) {
		guess = handleGuess($('#guess').val(), template);
		if(guess) {
			Rounds.update(this._id, { $addToSet: { guessedWords: guess }});
		}
   }
});

Template.guesser.created = function() {
  var that = this;
  Session.set('wordListStatus', 'loading');
  Meteor.call('loadWordList', 'nounlist.txt', function(error, result) {
    that.wordList = result;
    Session.set('wordListStatus', 'loaded');
  });
};

Template.guesser.helpers({
  disabledStatus: function() {
    if(Session.get('wordListStatus') === 'loading') {
      return {disabled: 'true', value: 'loading...'};
    } else {
      return '';
    }
  }
});

function handleGuess(guess, scope) {
  if(isWordInList(guess, scope.wordList)) {
    if(guessedWords.indexOf(guess) === -1) {
      guessedWords.push(guess);
			return guess;
    }
  }
};

function loadWordList(fileName) {
  return Meteor.call('loadWordList', fileName);
}

function isWordInList(word, wordList) {
  return wordList.indexOf(word) !== -1;
};
