"""Scrapes Reddit for a copy pasta and a meme."""
import praw
import codecs
import requests
import json

with open('auth/api_info.json') as reddit_auth_file:
    reddit_auth = json.load(reddit_auth_file)

user_agent = ("SunsetBot_2.0")
request = praw.Reddit(
    client_id=reddit_auth["client_id"],
    client_secret=reddit_auth["client_secret"],
    username=reddit_auth["username"],
    password=reddit_auth["password"],
    user_agent=user_agent)


def write_copy_pasta():
    """Get the copy pasta and write it to file."""
    copypastas = request.subreddit("copypasta").top("day", limit=1)
    copypasta = next(copypastas)

    copypasta_file = codecs.open('pasta_of_the_day.txt', 'w', 'utf-8')
    copypasta_file.write(copypasta.selftext)

    copypasta_file.close()


def write_dank_meme():
    """Get top meme."""
    dank_memes = request.subreddit("BikiniBottomTwitter").top("day", limit=1)
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
    """Download image and write to file."""
    response = requests.get(url)

    meme_file = open(file_name, 'wb')
    for chunk in response.iter_content(4096):
        meme_file.write(chunk)

    meme_file.close()

write_copy_pasta()
write_dank_meme()
