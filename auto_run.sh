#!/bin/zsh

python scrape.py
node sunset.js

while [ ! -f sunsets.txt ] && [ ! -f pasta_of_the_day.txt] && [ ! -f meme_of_day.jpg]
do
  sleep 2
done

node auto.js