var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var checkPostToken = require ('../lib/pos_modules/authenticatePost');
//var uid = require('rand-token').uid;
var createTransactionDTO = require('../lib/pos_modules/createTransactionDTO');
var mapTransaction = require('../lib/pos_modules/transactionMap');
var Transaction = require('../models/transaction');
var transaction = new Transaction();
//var validateTransaction = require('../lib/pos_modules/validateTransaction');
//var handleError = require('../lib/pos_modules/errorHandling');
var saveTransactionInDB = require('../lib/pos_modules/transactionSave');
var sendResponse =require('../lib/pos_modules/sendResponse');


router.get('/', function(req, res) {
    Transaction.find(function(err, transactions) {
        if (err)
            res.send(err);

        res.json(transactions);
    });
});

router.post('/', function(req, res) {
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

        //if (statusObject.isOK) validateTransaction(transactionDTO, statusObject);

        if (statusObject.isOK) {transaction = mapTransaction(transactionDTO, transaction, statusObject);};

        if (statusObject.isOK) { saveTransactionInDB(res, transaction, statusObject, finalizePost);
        } else {finalizePost();}

        function finalizePost () {

            sendResponse(res, statusObject);
        }
    }

});


module.exports = router;
