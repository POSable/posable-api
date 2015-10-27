var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var xmlparser = require('express-xml-bodyparser');

var api = require('./routes/api');
var healthcheck = require('./routes/healthcheck');
var payments = require('./routes/payments');
var transactions = require('./routes/transactions');
var errorHandling = require('./lib/pos_modules/errorHandling');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());

//Will catch any JSON syntax issues

app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).send({error: 400, message: "SyntaxError: Please send all values in String format"})
    }
});

app.use(xmlparser({
    explicitArray: false,
    mergeAttrs: true,
    ignoreAttrs: true,
    normalize: false,
    normalizeTags: false,
    trim: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use('/payments', payments);
<<<<<<< HEAD
app.use('/transactions', transactions);
=======
app.use('/healthcheck', healthcheck);
>>>>>>> 1a93c9d0e3bb79d249f3b302e6d136873f864cf6

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandling);

module.exports = app;
