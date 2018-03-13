// Initialise Node Message
console.log("Starting Twitter Bot...");

// Require NPM API's
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
	console.log("Follow event triggered!");
	var name = event.source.name;
	var screenName = event.source.screen_name;	

	// Respond to follow
	postTweet("Hey @" + screenName + ", Thank you for following!");
}

// Start Twitter Interaction
postTweet("suh");
//End Twitter Interaction

// -- POST RESPONSE --
function postTweet(tweetMsg) {
	
	// Settings
	PythonShell.run('./Python-Scripts/my_script.py', function (err) {
		if (err) throw err;
		console.log('Image Saved (./Media)');
		processing();
	});
	
	// Set Up Image & Upload to twitter staging room
	function processing() {	
		var filename = './Media/test.jpg';

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
		var id = data.media_id_string;
	
		// Since the image is uploaded, we construct our tweet obj:
		var tweet = {
 			status: tweetMsg + '\n' + 'Your random N-value: ' + r + '\n#CreedoBot',
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
