const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

// nodekb is the name of the database
// could have also used 'customers'
// Used to be: mongoose.connect('mongodb://localhost/nodekb');
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB')
});

// Check for DB errors
db.on('error', function(error){
  console.log(error);
})

// Initialise App
const app = express();

// Bring in the models
let Article = require('./models/article');


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
// Express Session (taken from Github Express Js Session)
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middlware
// Taken from Github Express Js Express Messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
// Taken from Github Express JS Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport config
require('./config/passport')(passport);
// Passport Middleware (from website)
app.use(passport.initialize());
app.use(passport.session());


// Global user variable
app.get('*', function(req, res, next){
  // we'll only have this object if we're logged in
  res.locals.user = req.user || null;
  next();
});


// Home Route
app.get('/', function(req, res) {
  // get all the storyes
  Article.find({}, function(err, articles){
    if (err){
      console.log(err)
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles

      });
    }
  });
});


// Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);
// anything that has localhost:3000/users will go
// to the users.js file
let users = require('./routes/users');
app.use('/users', users);



// Start Server
app.listen(3000, function(){
  console.log("Server started on port 3000...")
});
