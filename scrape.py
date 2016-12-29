"""Scrapes Reddit for a copy pasta and a meme."""
import praw
import codecs
import requests
import json

with open('auth/api_info.json') as data_file:
    data = json.load(data_file)

user_agent = ("CopyPasta 1.0")
request = praw.Reddit(
    client_id=data["client_id"],
    client_secret=data["client_secret"],
    username=data["username"],
    password=data["password"],
    user_agent=user_agent)


def write_copy_pasta():
    copypastas = request.subreddit("copypasta").top(limit=1)
    copypasta = next(copypastas)

    copypasta_file = codecs.open('pasta_of_the_day.txt', 'w', 'utf-8')
    copypasta_file.write(copypasta.selftext)

    copypasta_file.close()


def write_dank_meme():
    dank_memes = request.subreddit("BikiniBottomTwitter").top(limit=1)
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
    else:
        try:
            download(file_name, url)
        except:
            print "couldn't download because something went wrong"


def download(file_name, url):
    response = requests.get(url)

    meme_file = open(file_name, 'wb')
    for chunk in response.iter_content(4096):
        meme_file.write(chunk)

    meme_file.close()

write_copy_pasta()
write_dank_meme()
