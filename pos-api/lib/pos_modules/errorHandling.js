var express = require('express');
var app = express();
var log = require('./log');

var errorHandling = function(err, req, res) {
        res.status(err.status || 500);
        log.error({err: err.message});

        if (app.get('env') === 'development') {
            res.render('error', {
                message: err.message,
                error: err
            });
        } else {
            res.render('error', {
                message: err.message,
                error: {}  // <-- hides stacktrace in production
            });
        }
    };

module.exports = errorHandling;