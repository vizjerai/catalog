var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('./lib/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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

  logger.info(meta.remoteIp + ' ' + meta.method + ' ' + meta.url + ' HTTP/' + meta.httpVersion + ' referer: ' + meta.referer);

  if (meta.method == 'POST' || meta.method == 'PATCH' || meta.method == 'PUT') {
    logger.debug('params:', req.body);
  }

  res.on('finish', function() {
    var finishTime = process.hrtime(startTime);
    meta.statusCode = res.statusCode;
    meta.responseTime = finishTime[0] * 1e3 + finishTime[1] / 1e6;

    logger.info(meta.remoteIp + ' ' + meta.method + ' ' + meta.url + ' HTTP/' + meta.httpVersion + ' - ' + meta.statusCode + ' ' + meta.responseTime + 'ms' + ' referer: ' + meta.referer);
  });

  next();
});

app.use('/', routes);
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
