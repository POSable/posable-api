var express = require('express');
var router = express.Router();
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost');
var createTransactionDTO = require('../lib/pos_modules/api/createTransactionDTO');
var mapTransaction = require('../lib/pos_modules/api/mapTransaction');
var sendResponse =require('../lib/pos_modules/sendResponse');
//var Transaction = require('../models/transaction').model;
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');

//router.get('/', function(req, res) {
//    Transaction.find(function(err, transactions) {
//        if (err)
//            logPlugin.error(err);
//            res.send(err);
//
//        res.json(transactions);
//    });
//});


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

        if (statusObject.isOK) {transaction = mapTransaction(transactionDTO, statusObject);} // delete

        if (statusObject.isOK) {
            var valObject = validate.validateTransaction(transaction);
            if (valObject.isValid == false) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'Transaction Validation',
                    error: {code: 400, message: valObject.message} }
            }  else { statusObject.success.push('validated'); } }

        if (statusObject.isOK) {
            console.log("statusObject", statusObject);
            wascallyRabbit.raiseNewTransactionEvent(statusObject.merchant.internalID, transaction).then(finalizePost, function() {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'payment.js',
                    error: {code: 500, message: "System Error PaymentEvent did NOT publish to Rabbit"}
                };
                finalizePost();
            })
        } else {
            finalizePost();
        }
        function finalizePost () {
            console.log("in finalize post");
            if (statusObject.isOk && statusObject.merchant.responseType === 'alt') {
                console.log("before send to rabbit");
                wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, req.body).then(sendResponse(res, statusObject), function(err){
                    console.log("error sending req to rabbit", err);
                    sendResponse(res, statusObject);
                })

            } else {
                console.log("Response Type", statusObject);
                sendResponse(res, statusObject);
            }
        }
    }

});

module.exports = router;
