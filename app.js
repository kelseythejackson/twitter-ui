// These set up an Express app and require the appropriate modules
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const t = require('./config');
const moment = require('moment');

app.locals.moment = moment; // Sets a moment key on the locals object
app.use(express.static('public')); // Tells express where the static files are.
app.set('view engine', 'pug'); // Sets the templating engine for the app.

/*---
This middleware grabs the credentials, tweets, following list, and sent direct messages using the Twit module in config.js
And saves them as keys on the request object
---*/
app.use(
    (req, res, next) => {
        t.get('account/verify_credentials', { screen_name: t.screen_name }, (err, creds, res) => {
            req.creds = creds;
            next();
        });
    },
    (req, res, next) => {
        t.get('statuses/user_timeline', { screen_name: t.screen_name, count: 5, include_rts: true }, (err, data, res) => {
            req.tweets = data;
            next();
        });
    },
    (req, res, next) => {
        t.get('friends/list', { screen_name: t.screen_name, count: 15 }, (err, list, res) => {
            req.friendsList = list.users;
            next();
        });
    },
    (req, res, next) => {
        t.get('direct_messages/sent', { count: 5 }, (err, messages, res) => {
            req.messages = messages;
            next();
        });
    }
);


//In the get request, the data is saved as constants, then supplied to the route.

app.get('/', (req, res) => {
    const { creds, tweets, friendsList, messages } = req;
    res.render('index', { creds, tweets, friendsList, messages });
});

// sets up the server side of the live update feature
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', function(data){
        t.post('statuses/update', { status: data }, function(err, data, response) {
            const date = moment(data.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').fromNow();
            io.emit('chat message', {data, date});
        });
    });
});

// Error pages
app.use((req, res, next) => {
    const err = new Error('We have a problem on end and we\'re looking into it, sorry for the inconvenience.');
    err.status = 500;
    next();
});

app.use((req, res, next) => {
    const err = new Error('Hmmm, the page you\'re looking for isn\'t here, sorry about that.');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});


server.listen(3000, () => {
    console.log('App listening on port 3000!');
});
