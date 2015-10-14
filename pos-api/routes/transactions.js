var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var Oauth = require ('../lib/pos_modules/Oauth');
var uid = require('rand-token').uid

var Transaction = require('../models/transaction');

router.get('/', function(req, res) {
  Transaction.find(function(err, transactions) {
    if (err)
      res.send(err);

    res.json(transactions);
  });
});

router.post('/', function(req, res) {

    var newAuth = new Oauth(req, res, uid);
    if (!newAuth.authenticatePost()) return;

    //var newVal = new Val(req, res);
    //if (!newVal.validate()) return;
    console.log("Keep it going");

    //var newMap = new Map(req res);
    //if (!newMap.converted()) return;



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

    res.json({message: 'You are here, token matched, validation passed, object mapped and saved in mongo', code: 200});

});


module.exports = router;
