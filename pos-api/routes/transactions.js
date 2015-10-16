var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var Oauth = require ('../lib/pos_modules/Oauth');
var uid = require('rand-token').uid
var DTO = require('../lib/pos_modules/DTO');
var map = require('../lib/pos_modules/transactionMap')
var Transaction = require('../models/transaction.js');
var transaction = new Transaction();


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

    var transactionDTO = new DTO(req, res);
    if (!transactionDTO.getReqBody()) return;

    if (!map(transactionDTO.dto, transaction)) return;

    // Nick, this is the object you want ... transactionDTO.dto

    //var newVal = new Val();
    //if (!newVal.validate(transactionDTO.dto)) return;

    transaction.save(function (err, post) {
        if (err) { return next(err) }
        //this.res.status(201);
        //this.res.json(201, post);
    })

    res.json({message: 'You are here, token matched, validation passed, object mapped and saved in mongo', code: 200});

});


module.exports = router;
