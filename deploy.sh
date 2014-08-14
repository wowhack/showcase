#!/bin/sh

# Pull latest from origin and sync to Heroku
git pull origin master && git push heroku master
