var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
//Routes
var healthcheck = require('./routes/healthcheck');
var transactions = require('./routes/transactions');
var fullTransactions = require('./routes/fullTransactions');
var getToken = require('./routes/getToken');

var app = express();
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.xml({ xmlParseOptions: { explicitArray: false, trim: true }}));

//Will catch any JSON syntax issues
app.use(bodyParser.json());

app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).send({error: 400, message: "SyntaxError: Please send all values in String format"})
    } else {
        res.status(400).send({error: 400, message: error.message });
    }
    next(error);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/payments', payments);
app.use('/transactions', transactions);
app.use('/healthcheck', healthcheck);
app.use('/fullTransactions', fullTransactions);
app.use('getToken', getToken);

module.exports = app;