var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');

//Passport
var passport = require('passport');
require('./config/passport')(passport); // pass passport for configuration

//Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/classmate');

//Models
require('./models/user');
require('./models/course');
require('./models/fillTestData')(mongoose,handleError);

var routes = require('./routes/index');
var auth = require('./routes/auth/index');
var users = require('./routes/api/users');
var courses = require('./routes/api/courses');

function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'wiljewelwetenhe' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req,res,next){
    req.mongoose = mongoose;
    next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use('/', routes);
app.use('/auth', auth);
app.use('/api/users', users);
app.use('/api/courses', courses);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	var err = new Error('Not Found');
 	err.status = 404;
  	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
