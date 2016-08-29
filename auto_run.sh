#!/bin/zsh

python scrape.py
node sunset.js

while [ ! -f sunsets.txt ]
do
  sleep 2
done

node auto.js