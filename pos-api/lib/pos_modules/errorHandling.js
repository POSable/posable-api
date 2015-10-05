var express = require('express');
var app = express();

var errorHandling = function () {

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
};

module.exports = errorHandling;