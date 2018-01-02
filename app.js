const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const t = require('./config');
const moment = require('moment');

app.locals.moment = moment;
app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(
    (req, res, next) => {
        t.get('account/verify_credentials', { name: 'Kelsey Jackson'}, (err, creds, res) => {
            req.creds = creds;
            next(); 
        });
    },
    (req, res, next) => {
        t.get('statuses/user_timeline', { screen_name: 'paisley_darts', count: 5, include_rts: true }, (err, data, res) => {
            req.tweets = data;
            next();
        });
    },
    (req, res, next) => {
        t.get('friends/list', { screen_name: 'paisley_darts', count: 15 }, (err, list, res) => {
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

app.get('/', (req, res) => {
    const { creds, tweets, friendsList, messages } = req;
    res.render('index', { creds, tweets, friendsList, messages });
});

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
server.listen(3000, () => {
    console.log('App listening on port 3000!');
});