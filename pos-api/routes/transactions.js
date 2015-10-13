var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var token = require ('../lib/pos_modules/Oauth');

var Transaction = require('../models/transaction');


router.get('/', function(req, res) {
  Transaction.find(function(err, transactions) {
    if (err)
      res.send(err);

    res.json(transactions);
  });
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

    if (req.headers.token === null || req.headers.token === undefined ){
        var errAuth1 = new Error();
        errAuth1.message = "Unauthorized, token is missing";
        res.json({error: errAuth1.message, file: errAuth1.fileName, line: errAuth1.lineNumber, code: 401});
    } else if (req.headers.token === token) {
        res.json({message: 'You are here & token matched', code: res.statusCode});
    } else {
        var errAuth2 = new Error();
        errAuth2.message = "Unauthorized, incorrect token";
        res.json({error: errAuth2.message, file: errAuth2.fileName, line: errAuth2.lineNumber, code: 401});
    }
});

module.exports = router;
