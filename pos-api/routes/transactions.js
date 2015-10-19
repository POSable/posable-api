var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var Oauth = require ('../lib/pos_modules/Oauth');
var uid = require('rand-token').uid;
var DTO = require('../lib/pos_modules/DTO');
var map = require('../lib/pos_modules/transactionMap');
var Transaction = require('../models/transaction.js');
var transaction = new Transaction();
var o2x = require('object-to-xml');
var Val = require('../lib/pos_modules/validation');


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
    console.log("finished auth");

    var transactionDTO = new DTO(req, res);
    if (!transactionDTO.getReqBody()) return;
    console.log("finished DTO");

    if (!map(transactionDTO.dto, transaction)) return;
    console.log("mapped DTO to Transaction");

    var newVal = new Val(req, res, transactionDTO);
    if (!newVal.paymentValidator()) return;
    console.log("finished Validations")

    transaction.save(function (err, post) {
        //if (err) { return next(err) }
    });

    if (res.req.headers['content-type'] === 'application/xml') {
        res.send(o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            message: 'You are here, token matched, validation passed, object mapped and saved in mongo',
            error: err,
            code: 200
        }))

    } else {
        res.json({
            message: 'You are here, token matched, validation passed, object mapped and saved in mongo',
            error: err,
            code: 200
        });
    }

    res.json({message: 'You are here, token matched, validation passed, object mapped and saved in mongo', code: 200});

});


module.exports = router;
