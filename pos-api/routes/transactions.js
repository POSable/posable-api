var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var Oauth = require ('../lib/pos_modules/Oauth');
var uid = require('rand-token').uid;
var DTO = require('../lib/pos_modules/DTO');
var map = require('../lib/pos_modules/transactionMap');
var Transaction = require('../models/transaction');
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
    console.log("Post received with content type of ", req.headers['content-type'])

    var newAuth = new Oauth(req, res, uid);
    if (!newAuth.authenticatePost()) return;
    console.log("finished Oauth");

    var transactionDTO = new DTO(req, res);
    if (!transactionDTO.getReqBody()) return;
    console.log("finished DTO");

    if (!map(transactionDTO.dto, transaction, res)) return;
    console.log("finished mapping DTO to Transaction");

    var newVal = new Val(req, res, transactionDTO);
    if (!newVal.paymentValidator()) return;
    console.log("finished Validations")

    transaction.save(function (err, post) {
        if (err) {
            var message = "DB Error";
            res.status(500);
            if (res.req.headers['content-type'] === 'application/xml') {
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    error: message,
                }));
            } else {
                res.json({
                    error: message,
                });
            }
        } else {
            console.log("Posted this object to DB ", post);
            if (res.req.headers['content-type'] === 'application/xml') {
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    message: 'POS API Transaction, token matched, validation passed, object mapped and saved in mongo',
                }))
            } else {
                res.json({
                    message: 'POS API Transaction, token matched, validation passed, object mapped and saved in mongo',
                });
            }
        }
    });
});


module.exports = router;
