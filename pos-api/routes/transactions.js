var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost');
//var uid = require('rand-token').uid;
var createTransactionDTO = require('../lib/pos_modules/api/createTransactionDTO');
var mapTransaction = require('../lib/pos_modules/api/mapTransaction');
var createValTransObj = require('../lib/pos_modules/api/validateTransaction');
//var handleError = require('../lib/pos_modules/errorHandling');
var saveTransactionInDB = require('../lib/pos_modules/api/saveTransaction');
var sendResponse =require('../lib/pos_modules/sendResponse');
var Transaction = require('../models/transaction').model;
var publishToLogger = require('../lib/pos_modules/publishObject').toServiceLogger;


router.get('/', function(req, res) {
    Transaction.find(function(err, transactions) {
        if (err)
            res.send(err);

        res.json(transactions);
    });
});

router.post('/', function(req, res) {
    var transaction;
    console.log("Transactions Post received with content type of", req.headers['content-type']);
    var statusObject = {isOK: true, success: []};
    var transactionDTO = {};

    if (statusObject.isOK) {
        checkPostToken(req, statusObject, continuePost);
    }

    function continuePost(err, statusObject) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "checkPostToken",
                error: {message: "System Error with Token Authentication"}
            }
        }

        if (statusObject.isOK) {transactionDTO = createTransactionDTO(req, statusObject);}

        if (statusObject.isOK) {
            var transactionObj = createValTransObj(transactionDTO);
            transactionObj.validateTransaction(statusObject); }

        if (statusObject.isOK) {transaction = mapTransaction(transactionDTO, statusObject);}

          if (statusObject.isOK) { saveTransactionInDB(res, transaction, statusObject, finalizePost);
        } else {finalizePost();}

        function finalizePost () {
            try {
                publishToLogger(transactionDTO);
                sendResponse(res, statusObject);
            } catch (err) {
                console.log(err);
            }
        }
    }

});

module.exports = router;
