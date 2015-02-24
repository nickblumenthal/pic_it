var guessedWords = new ReactiveArray();

Template.guesser.events({
	'keyup #guess': function (event, template) {
	   handleGuess($('#guess').val(), template);
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
	guesses: function() {
	  return guessedWords.list();
	},

  disabledStatus: function() {
    if(Session.get('wordListStatus') === 'loading') {
      return {disabled: 'true', value: 'loading...'};
    } else {
      console.log('test2');
      return '';
    }
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
