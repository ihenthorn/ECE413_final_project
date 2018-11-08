// server.js
var express = require('express')
var bodyParser = require('body-parser');
var path = require('path');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var devicesRouter = require('./routes/devices');
var activitiesRouter = require('./routes/activities');

var app = express();
var port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// This is to enable cross-origin access
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// The following allows use to send a JSON response using .json() instead of
// .send(JSON.stringify())
app.use(express.json());

// The following will URL query strings. Key/value
// pairs will be accessible using req.query.key
app.use(express.urlencoded({ extended: false }));

// The following will parse JSON data passed in the body. Key/value
// pairs will be accessible using req.body.key
app.use(bodyParser.json());

// The following will parse URL encoded parameters. Key/value
// pairs will be accessible using req.params.key
app.use(bodyParser.urlencoded({ extended: false }));

// serve static pages in public/ folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/devices', devicesRouter);
app.use('/activities', activitiesRouter);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
})
