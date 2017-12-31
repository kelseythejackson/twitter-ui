const express = require('express');
const app = express();
const t = require('./config');

app.use(express.static('public'));
app.set('view engine', 'pug');



app.use(
    (req, res, next) => {
        t.get('statuses/user_timeline', { screen_name: 'paisley_darts', count: 5, include_rts: true }, function (err, data, res) {
           
            req.tweets = data;
            next();
        });
    },
    (req, res, next) => {
        t.get('friends/list', { screen_name: 'paisley_darts', count: 15 }, function (err, list, res) {
            req.friendsList = list.users;
            next(); 
        });  
    },
    (req, res, next) => {
        t.get('direct_messages/sent', { count: 5 }, function (err, messages, res) {
            req.messages = messages;
            next(); 
        });  
    }
);

app.get('/', (req, res) => {
    const { tweets, friendsList, messages } = req;
    
    
    // console.log(tweets[0].retweeted_status.retweet_count);
    // console.log(tweets[0].retweeted_status.favorite_count);
    // console.log(tweets[0].retweeted_status);
    console.log(tweets[0]);
    
    res.render('index', { tweets, friendsList, messages });
})
app.listen(3000, () => {
    console.log('App listening on port 3000!');
});