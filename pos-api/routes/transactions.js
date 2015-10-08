var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');

var Transaction = require('../models/transaction');


router.get('/', function(req, res) {
    res.json({message: 'You are here', code: res.statusCode});
});

router.post('/', function(req, res) {
    var transaction = new Transaction({
        amount: req.body.amount
    })

    transaction.save(function (err, post) {
        if (err) { return next(err) }
        res.json(201, post)
    })
})

module.exports = router;
