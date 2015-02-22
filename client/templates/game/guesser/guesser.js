Template.guesser.events({
	'keyup #guess': function () {
	   handleGuess($('#guess').val());
   }
});

Template.guesser.rendered = function() {
  Template.guesser.wordList = loadWordList('nounlist.txt');
  Template.guesser.guesses = [];
};

Template.guesser.helpers({
	guesses: function () {
    console.log(Template.guesser.guesses);
		return Template.guesser.guesses;
	}
});

function handleGuess(guess) {
  if(isWordInList(guess, Template.guesser.wordList)) {
    if(Template.guesser.guesses.indexOf(guess) === -1) {
      Template.guesser.guesses.push(guess);
      console.log(Template.guesser.guesses);
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
