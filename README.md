# Twitter-Bot

!["Twitter Bot Logo"](./Media/twitter_bird_robot.png)

---
### A Creedo-Bot project
> The basic idea is when a user tweets me or follows me they will receive a message, thanking them.  
> This is a small project.
> This project idea is best utilised on a server
---

### Important code snippets & Information will be logged below
#### Current Iteration of the bot:
Currently the bot automatically retweets something interesting based on a selection of interesting topics.  
For example, the bot may retweet something interesting about software engineering in one tweet, and then may  
retweet something about gaming or art.  

This is based on an **array of topics** that I have initialised.  
The bot picks a random topic from the array using random.choice(array) and then finds a tweet that has  
a hashtag of the topic we randomly chose.  

To achieve this automatic functionality, one must have a server where a python script is run 24/7.  
We use nohup (No Hangup) to prevent the script from finishing upon logging out from the server.  
I personally use a DigitalOcean server. Links to both DigitalOcean & my twitter can be found below.  

+ [DigitalOcean](https://www.digitalocean.com/)
+ [My Twitter](https://twitter.com/shane_creedon)
