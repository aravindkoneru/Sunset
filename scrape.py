import praw

user_agent = ("CopyPasta 1.0")

request = praw.Reddit(user_agent = user_agent)
copypastas = request.get_subreddit("copypasta").get_top(limit = 1)
copypasta = next(copypastas)

copypasta_file = open('pasta_of_the_day.txt', 'w')
copypasta_file.write(copypasta.selftext)

copypasta_file.close()
