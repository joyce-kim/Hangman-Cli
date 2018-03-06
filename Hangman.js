var inquirer = require("inquirer");
var wordList = require("./wordlist.js");

var remainingGuesses;

function Hangman() {
	// saves "this" for use in inquirer
	var self = this;

	// starts the game
	this.start = function() {
		inquirer
	    	.prompt([
		        {
					type: "confirm",
					name: "input",
					message: "Start Hangman?"
		        }
			])
	      .then(function(val) {
	      	// if user inputs (Y), val.input is positive, and starts game
	        if (val.input) {
				self.currentWord = new Word(self.newWord());
	        	self.guessCount = Math.floor(self.currentWord.letters.length*1.5);
	        	self.trackGuesses();
	        // else run exit code
	        } else {
	        	self.exitGame();
	        }
	      });
	};

	// grabs random word from imported file of words	
	this.newWord = function() {
		var randomNum = Math.round(Math.random()*20);
		var randomWord = wordList[randomNum];
		return randomWord;
	};

	// regulates game by keeping track of remaining guesses
	this.trackGuesses = function() {
		this.promptUser().then(function() {
			if (self.guessCount < 1) {
				console.log("GAME OVER!");
				self.start();
			} else {
				self.trackGuesses();
			};
		});
	}
	
	// prompts user using Inquirer to make guess
	this.promptUser = function() {
	    return inquirer
	    	.prompt([
		        {
					type: "input",
					name: "input",
					message: "Press Key to Guess a Letter!"
		        }
			])
	    .then(function(val) {
	    	// checks user guess using Word constructor's checkWord function
			var guessedCorrectly = self.currentWord.checkWord(val.input);

			if (guessedCorrectly) {
				console.log("CORRECT!");
				self.currentWord.display(); 
				console.log("Guesses Remaining: " + self.guessCount);
			} else {
				console.log("WRONG!");
				self.currentWord.display(); 
				self.guessCount--;
				console.log("Guesses Remaining: " + self.guessCount);
			}
	        
		});
	};

	this.exitGame = function() {
		console.log("Better Luck Next Time!");
		process.exit(0);
	}
}

// Used to create an object representing the current word the user is attempting to guess. 
// This should contain word specific logic and data.
function Word(word) {
	// saves the original word
	this.word = word;
	// creates
	this.letters = word
		.split("")
		.map( letter => { return new Letter(letter); });

	this.display = () => {
		var concat = "";
		this.letters.map( letter => {
			concat += letter.state;
		});
		console.log(concat);
	}

	// checks each letter of the word for match
	this.checkWord = guess => {
		var guessedCorrectly = false;
		this.letters.map( letter => {
			if ( letter.checkLetter(guess)) {
				guessedCorrectly = true;
			}
		});
		return guessedCorrectly;
	}

	// checks if all letters have been guessed
	this.guessedWord = () => {
		var guessedCorrectly = true;
		this.letters.map( letter => {
			if (letter.guessed === false) {
				guessedCorrectly = false;
			} else {
				guessedCorrectly = true;
			}
		});
		return guessedCorrectly;
	}
}

// Used for each letter in the current word. 
// Each letter object should either display an underlying character, 
// or a blank placeholder (such as an underscore), 
// depending on whether or not the user has guessed the letter.
// This should contain letter specific logic and data.
function Letter(letter) {
	// saves the original letter
	this.value = letter;

	// state of the visible character
	this.state = "_";

	// tracks if the letter has been guessed correctly
	this.guessed = false;

	// checks to see if input is equivalent to the letter
	this.checkLetter = guess => {
		if (guess === letter) {
			this.guessed = true;
			this.state = this.value;
			return true
		} 
		return false;
	};
};

var game = new Hangman();
game.start();