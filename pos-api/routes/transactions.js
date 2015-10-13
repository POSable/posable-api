var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');

var Transaction = require('../models/transaction');


router.get('/', function(req, res) {
    res.json({message: 'You are here', code: res.statusCode});
});

router.post('/', function(req, res) {
    var transaction = new Transaction();

    transaction.cardType = req.body.cardType;
    transaction.amount = req.body.amount;
    transaction.last4OfCard = req.body.last4OfCard;
    transaction.authorizationCode = req.body.authorizationCode;
    transaction.tax = req.body.tax;
    transaction.terminalID = req.body.terminalID;
    transaction.merchantID = req.body.merchantID;
    transaction.transactionType = req.body.transactionType;
    transaction.netEPaySN = req.body.netEPaySN;
    transaction.userId = req.body.userId;

    transaction.save(function (err, post) {
        if (err) { return next(err) }
        res.json(201, post)
    })
})

module.exports = router;
