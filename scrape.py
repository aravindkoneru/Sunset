import praw
import codecs
import urllib
import re


user_agent = ("CopyPasta 1.0")
request = praw.Reddit(user_agent = user_agent)

def writeCopyPasta:
	copypastas = request.get_subreddit("copypasta").get_top(limit = 1)
	copypasta = next(copypastas)

	copypasta_file = codecs.open('pasta_of_the_day.txt', 'w', 'utf-8')
	copypasta_file.write(copypasta.selftext)

	copypasta_file.close()

def writeDankMeme:
	dank_memes = request.get_subreddit("BikiniBottomTwitter").get_top(limit=1)
	meme = next(dank_memes)

	

	# for meme in dank_memes:
	# 	print meme.url

	urllib.urlretrieve(meme.url, "00000001.jpg")

	# print(dank_meme)

# direct image link: http://i.imgur.com/azDHl29.png
# imgur link: http://imgur.com/azDHl29
# imgur album link: http://imgur.com/a/WDwyW

#general form: http://{i.}imgur.com/{a/}[sometext]{.png}