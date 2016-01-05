var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
//Routes
var healthcheck = require('./routes/healthcheck');
//var payments = require('./routes/payments');
var transactions = require('./routes/transactions');
var collections = require('./routes/collections');
//var errorHandling = require('./lib/pos_modules/errorHandling');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

//Will catch any JSON syntax issues

app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).send({error: 400, message: "SyntaxError: Please send all values in String format"})
    } else {
        res.status(400).send({error: 400, message: error.message });
    }
    next(error);
});

app.use(xmlparser({
    explicitArray: false,
    normalize: false,
    normalizeTags: false,
    trim: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/payments', payments);
app.use('/transactions', transactions);
app.use('/healthcheck', healthcheck);
app.use('/collections', collections);

// catch 404 and forward to error handler - this crashed Elastic Beanstalk!!!
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//    err.status = 404;
//    errorHandling(err, res);
//    next(err);
//});

module.exports = app;
