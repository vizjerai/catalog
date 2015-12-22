var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('./lib/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var methodOverride = require('./lib/method_override');
var session = require('express-session'); // TODO: this throws deprecation warnings

var routes = require('./routes/index');
var catalog_items = require('./routes/catalog_items');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride);
app.use(bodyParser.json());

app.use(session({secret: 'i have no secret'})); // TODO: set secret in config
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  var startTime = process.hrtime();

  var meta = {
    method: req.method,
    url: req.url,
    httpVersion: req.httpVersionMajor + '.' + req.httpVersionMinor,
    remoteIp: req.ip || req.connection.remoteAddress || (req.socket && req.socket.remoteAddress) || (req.socket.socket && req.socket.socket.remoteAddress) || '127.0.0.1',
    referer: req.header('referer') || req.header('referrer') || ''
  }

  logger.info('%s %s %s HTTP/%s referer: %s', meta.remoteIp, meta.method, meta.url,
    meta.httpVersion, meta.referer);

  if (meta.method == 'POST' || meta.method == 'PATCH' || meta.method == 'PUT') {
    logger.debug('params:', req.body);
  }

  res.on('finish', function() {
    var finishTime = process.hrtime(startTime);
    meta.statusCode = res.statusCode;
    meta.responseTime = finishTime[0] * 1e3 + finishTime[1] / 1e6;

    logger.info('%s %s %s HTTP/%s - %s %sms referer: %s', meta.remoteIp, meta.method, meta.url,
      meta.httpVersion, meta.statusCode, meta.responseTime, meta.referer);
  });

  next();
});

var config = require('./lib/config');
var GOOGLE_CLIENT_ID = config.google.client_id;
var GOOGLE_CLIENT_SECRET = config.google.client_secret;

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Passport Session Setup
// serializes the whole google profile into the session
// deserializes the whole google profile from the session
//
//  TODO: set the user id into the session and find user by id when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
//
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://dev.vizjerai.com:3002/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  // asynchronous verification
  process.nextTick(function() {

    // currently returns whole google profile.
    // Typical application should associate the Google Account with a user in the database,
    // and return that user instead.
    return done(null, profile);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res) {
  res.render('login', {title: 'Login', user: req.user});
});

app.get('/auth/google',
  passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}),
  function(req, res) {
    // should not be called
  });

app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.use('/', routes);
app.use('/catalog_items', catalog_items);
app.use('/users', users);

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
