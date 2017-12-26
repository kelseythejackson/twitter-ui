const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const t = require('./config');
app.use(express.static('public'));
app.set('view engine', 'pug');
app.locals.moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));


    


app.use((req, res, next) => {
    t.get('account/verify_credentials', { name: 'Kelsey Jackson'}, function (err, creds, res) {
        req.creds = creds;
        console.log(req.creds);
        next(); 
    });
});

app.use((req, res, next) => {
    t.get('statuses/user_timeline', { screen_name: 'paisley_darts', count: 5 }, function (err, tweets, res) {
        req.tweets = tweets;
        // console.log(tweets[0]);
        next(); 
    });
});

app.use((req, res, next) => {
    t.get('friends/list', { screen_name: 'paisley_darts', count: 15 }, function (err, list, res) {
        req.list = list.users;
        next(); 
    });
});

app.use((req, res, next) => {
    t.get('direct_messages/sent', { count: 5 }, function (err, messages, res) {
        req.messages = messages;
        next(); 
    });
});

app.use((req, res, next) => {
    const { post } = req.body;
    req.post = post;
    console.log(req.post);
    next();
});

app.use('/',(req, res) => {
    const { list }  = req;
    const { creds } = req;
    const { tweets } = req;
    const { messages } = req;

    res.render('index', { list, creds, tweets, messages });
    next();
}); 

app.post('/', (req, res, next)=> {
    const {post} = req;
    res.render('index', post);
});




app.listen(3000, () => {
    console.log('App listening on port 3000!');
});