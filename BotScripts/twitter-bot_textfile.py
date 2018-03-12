# Add all import statements at top of file
import tweepy
from time import sleep
from credentials import *

# Access and authorize our Twitter credentials from credentials.py
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

my_file = open('../Books/verne.txt', 'r')
file_lines = my_file.readlines()
my_file.close()

def tweet():
	for line in file_lines:
		try:
			print(line)
			if line != '\n':
				# Once we hit a line that has not been tweeted before.
				# Tweet it and wait 10 seconds
				api.update_status(line)
				sleep(60)

		except tweepy.TweepError as e:
			# If we encounter an error
			# Or if a duplicate post has already been made
			print(e.reason)
			sleep(2)

tweet()
	
