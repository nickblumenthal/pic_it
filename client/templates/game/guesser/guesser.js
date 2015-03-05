// var guessedWords = new ReactiveArray();

Template.guesser.events({
	'keyup #guess': function (event, template) {
		handleGuess($('#guess').val().toLowerCase(), template);
		// guess = handleGuess($('#guess').val().toLowerCase(), template);
		// if(guess) {
		// 	guesses = this.guessedWords;
		// 	guesses.unshift(guess);
		// 	Rounds.update(
		// 		{"_id": this._id},
		// 		{
		// 			$set: {
		// 				guessedWords: guesses
		// 			}
		// 		}
		// 	);
		// }
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
    // if(guessedWords.indexOf(guess) === -1) {
    //   guessedWords.unshift(guess);
		// 	Meteor.call('checkGuess', guess, scope.data._id);
		// 	return guess;
    // }
		Meteor.call('checkGuess', guess, scope.data._id);
  }
};

function loadWordList(fileName) {
  return Meteor.call('loadWordList', fileName);
}

function isWordInList(word, wordList) {
  return wordList.indexOf(word) !== -1;
};
