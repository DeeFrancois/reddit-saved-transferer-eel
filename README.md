# Reddit Saved Transferer

A program built for browsing your reddit saves and transferring them to another account (or subreddit).

![demo](https://github.com/DeeFrancois/FileTagger_ElectronVersion/blob/main/DocumentationImages/demo.png)

Also allows you to browse subreddits, filter your saves by subreddit, preview the media, and unsave/save posts.

## Motivation

I found out a while ago that your Saved list on Reddit isn't infinite so I made this so I could transfer some of my saves to a different account. 
While working on this I noticed reddit doesn't have much functionality for sorting/browsing your saved list so that also became a part of it.

## Usage

![demo](https://github.com/DeeFrancois/FileTagger_ElectronVersion/blob/main/DocumentationImages/demo.gif)

## Main Python Libraries:
- Python-Eel 
- Praw 

requirements.txt file included so you use the following command to install the rest:

    pip3 install -r requirements.txt

## Features
- Automated transferring of posts to another account/subreddit
- Retrieve the last 1000 posts in your saved list (API Limit, but when you unsave a post you can see even older saves)
- Retrieve the last 100 posts from a subreddit (by top/hot/new)
- View media within the app
- Hotlinks so you can open a post in your browser
- Filter/sorting options
- Extract saved posts that have been deleted

## Current Issues

Licensed under the [MIT License](LICENSE).
