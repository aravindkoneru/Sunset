import praw
import codecs
import urllib
import requests

user_agent = ("CopyPasta 1.0")
request = praw.Reddit(user_agent = user_agent)

def writeCopyPasta():
	copypastas = request.get_subreddit("copypasta").get_top(limit = 1)
	copypasta = next(copypastas)

	copypasta_file = codecs.open('pasta_of_the_day.txt', 'w', 'utf-8')
	copypasta_file.write(copypasta.selftext)

	copypasta_file.close()

def writeDankMeme():
	dank_memes = request.get_subreddit("BikiniBottomTwitter").get_top(limit=1)
	meme = next(dank_memes)
	url = meme.url
	file_name = "meme_of_day.jpg"

	if 'http://i.imgur.com/' in url:
		download(file_name, url)
	elif 'http://imgur.com/' in url:
		image_url = 'http://i.imgur.com'
		image_url += url[url.rfind('/'):] + ".jpg"
		download(file_name, image_url)
	elif 'https://i.redd.it/' in url:
		download(file_name, url)
	elif 'http://imgur.com/a/' in url:
		print "Is an album, can't download the meme of the day"

def download(file_name, url):
	response = requests.get(url)

	meme_file = open(file_name, 'wb')
	for chunk in response.iter_content(4096):
		meme_file.write(chunk)

	meme_file.close()

writeCopyPasta()
writeDankMeme()