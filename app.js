var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');

var game = require('./game/routes');
var engine = require('./engine/routes');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Logger
app.use(logger('dev'));

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// Set static dir
app.use(express.static(path.join(__dirname, 'static')));

// Routing
app.use('/', game);
app.use('/api', engine);

// If we could not get a page catch a 404
// and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the app
module.exports = app;
