// Initialise Node Message
console.log("Starting Twitter Bot...");

// Require NPM API's
// It looks in the node_modules folder for twit package
var Twit = require('twit');

// Config package (We made it)
// Specify path, not just filename
var config = require('./config');

// Filesystem API
// used for saved information directly to file (JSON_output.txt)
var fs = require('fs');

// More twit api important OAuth information.
// Much cleaner with config file!
var T = new Twit(config);
console.log("> Config file successfully loaded.");

// Start Twitter Interaction
// Apply Automation settings using setInterval()
setInterval(postTweet, 1000*20)
//End Twitter Interaction

// -- POST RESPONSE --
function postTweet() {

	// Settings
	var r = Math.floor(Math.random()*100);

	// Create tweet object (passed into post)
	var tweet = {
		status: 'Random N-value: ' + r + '\n#CreedoBot'
	}

	function tweeted(err, data, response) {
		console.log("~ Posting to Twitter...");
		// This callback function is not really necessary for a POST RESPONSE
		// Since we are not returning any information.
		// So, lets use it for a validity check.
		if (err) {
			console.log("Something went wrong!");
		}
		else {
			console.log("-----------------------------");
			console.log("| Successfully posted tweet |");
			console.log("-----------------------------");
		}
	}

	T.post('statuses/update', tweet, tweeted);
}

// -- GET REQUEST -- 
function getTwitterInformation() {
	// Refactor Method to make it more digestable
	// Paramaters for twitter search query
	var params = { 
		q: 'Zelda',		// Hashtag
		count: 2		// 2 tweet returned
	}

	// callback function -> When data received...
	function dataReceived(err, data, response) {
		console.log("~ Receiving data from Twitter...\n");

		// Store JSON data in seperate file
		fs.writeFile("JSON_OUTPUT.txt", JSON.stringify(data, null, '-----------\n'), function(err) {
    		if(err) {
        		return console.log(err);
    		}
			else {
				console.log("> JSON successfully saved locally\n");
			}
		});

		// Receive data from twitter
		var tweets = data.statuses;

		for(var i = 0; i < tweets.length; i++) {
			console.log("------------------------------");
			console.log("Twitter User: " + tweets[i].user.screen_name);
			console.log("Created At: " + tweets[i].created_at);
			console.log("Tweet: " + tweets[i].text + '\n');
		}

		console.log("------------------------------------------------");
		console.log("| Information successfully received from Twitter |");
		console.log("--------------------------------------------------");
	}

	// Returns a heap of JSON information based on twitter information
	// parse information in dataReceived callback since data variable is there.
	T.get('search/tweets', params, dataReceived);
}
