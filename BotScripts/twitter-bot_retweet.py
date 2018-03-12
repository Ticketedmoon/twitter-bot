import tweepy
import random
from time import sleep
from credentials import *

# Access and authorize our Twitter credentials from credentials.py
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# Array of random cool interesting topics
topics = ["Gaming", "RPG", "SoftwareEngineering", "Artistic", "IRFU", "ComputerScience",
		  "Speedrun", "Google"]

choice = random.choice(topics)
print(choice)

# For loop to iterate over tweets with #ocean, limit to 10
for tweet in tweepy.Cursor(api.search,q=choice).items():

	try:
		# Print out usernames of the last 10 people to use #ocean
		print('\nTweet by: @' + tweet.user.screen_name)

		tweet.retweet()
		print("Retweeted that tweet")
		sleep(3600)

	except tweepy.TweepError as e:
		print(e.reason)

	except StopIteration:
		break
