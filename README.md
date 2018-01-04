# Twitter UI
A User Interface to consume Twitter's API

## Prerequisites
* Git
* Node

## Installation
* `git clone https://github.com/kelseythejackson/twitter-ui.git`
* `cd twitter-ui`
* `npm install`

## Config file
You'll need to create a config.js file in the root folder and populate it with the keys and access tokens when you create a twitter app. This is a good link that show's you how to do that (note "screen_name" is your twitter username) :
[How to Create a Twitter App in 8 Easy Steps](https://iag.me/socialmedia/how-to-create-a-twitter-app-in-8-easy-steps/)

```javascript
const Twit = require('twit');

const t = new Twit({
    consumer_key: '_ _ _ _',
    consumer_secret: '_ _ _ _',
    access_token: '_ _ _ _',
    access_token_secret: '_ _ _ _',
    screen_name: '_ _ _ _'
});

module.exports = t;
```


## Running
* `npm start`