var guessedWords = new ReactiveArray();

Template.guesser.events({
	'keyup #guess': function (event, template) {
	   handleGuess($('#guess').val(), template);
   }
});

Template.guesser.created = function() {
  this.wordList = loadWordList('nounlist.txt');
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

  var wordList = ['cat', 'dog'];

  return wordList;
};

function isWordInList(word, wordList) {
  return wordList.indexOf(word) !== -1;
};
