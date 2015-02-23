var guessedWords = new ReactiveArray();

Template.guesser.events({
	'keyup #guess': function (event, template) {
	   handleGuess($('#guess').val(), template);
   }
});

Template.guesser.created = function() {
  var that = this;
  Meteor.call('loadWordList', 'nounlist.txt', function(error, result) {
    that.wordList = result;
  });
};

Template.guesser.helpers({
	guesses: function() {
    console.log(guessedWords);
	  return guessedWords.list();
	}
});

function handleGuess(guess, scope) {
  if(isWordInList(guess, scope.wordList)) {
    if(guessedWords.indexOf(guess) === -1) {
      guessedWords.push(guess);
      console.log(guessedWords);

    }
  }
};

function loadWordList(fileName) {
  return Meteor.call('loadWordList', fileName);
}

function isWordInList(word, wordList) {
  return wordList.indexOf(word) !== -1;
};
