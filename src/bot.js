// Initialise Node Message
console.log("Starting Twitter Bot...");

// Other Fields / Variables
var newFollower = false;

// Begin Requires
// It looks in the node_modules folder for twit package
var Twit = require('twit');

// Config package (We made it)
// Specify path, not just filename
var Config = require('./config');

// Filesystem API
// used for saved information directly to file (JSON_output.txt)
var Fs = require('fs');

// Python NPM package
var PythonShell = require('python-shell');

// More twit api important OAuth information.
// Much cleaner with config file!
var T = new Twit(Config);
console.log("> Config file successfully loaded.");

var stream = T.stream('user');
stream.on('follow', followed);

// Function takes event parameter relating to the 'user' who followed.
// event is the User object.
function followed(event) {
	// Default Info
	newFollower = true;
	console.log("Follow event triggered!");
	var name = event.source.name;
	var screenName = event.source.screen_name;	

	// Respond to follow
	postTweet("Hey @" + screenName + ",\nThank you for following!");
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Start Twitter Interaction
setInterval( function() {
	postTweet("Random Image of the Day")
}, 1000*60*60*24);
// End Twitter Interaction

// -- POST RESPONSE --
function postTweet(tweetMsg) {
	
	// Settings
	var randomNum = getRandomInt(1, 18);
	processing();
	
	// Set Up Image & Upload to twitter staging room
	function processing() {	
		var filename = './Temp-Images/image-' + randomNum + '.png';
		var params = {
			encoding: 'base64'
		}

		var b64 = Fs.readFileSync(filename, params);
		T.post('media/upload', { media_data: b64}, uploaded); // uploaded is callBack
	}

	// Callback function when image is uploaded
	function uploaded(err, data, response) {
		
		console.log("Image successfully pushed to Twitter staging...");

		var r = Math.floor(Math.random()*100);
		var id = null;

		// Check if its a follower notification or image of the day
		// If follower, don't show image, simply thank them...
		if (!newFollower) {
			id = data.media_id_string;
			newFollower = false;
		}
	
		// Since the image is uploaded, we construct our tweet obj:
		var tweet = {
 			status: tweetMsg + '\n' + 'Your lucky number today is: ' + r + '\n#CreedoBot',
			media_ids: [id]
		}
	
		T.post('statuses/update', tweet, tweeted);
		
	}

	function tweeted(err, data, response) {
		console.log("~ Posting to Twitter...");
		// This callback function is not really necessary for a POST RESPONSE
		// Since we are not returning any information.
		// So, lets use it for a validity check.
		if (err) {
			console.log(err);
			console.log("Something went wrong!");
		}
		else {
			console.log("-----------------------------");
			console.log("| Successfully posted tweet |");
			console.log("-----------------------------");
		}
	}

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
		Fs.writeFile("./Log-Files/JSON_OUTPUT.txt", JSON.stringify(data, null, '-----\n'), function(err) {
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
