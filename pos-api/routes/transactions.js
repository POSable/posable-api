//var express = require('express');
//var router = express.Router();
//var log = require('../lib/pos_modules/log');
//var checkcPostToken = require ('../lib/pos_modules/authenticatePost');
////var uid = require('rand-token').uid;
//var createPaymentDTO = require('../lib/pos_modules/DTO');
//var map = require('../lib/pos_modules/transactionMap');
//var Transaction = require('../models/transaction');
//var transaction = new Transaction();
//var o2x = require('object-to-xml');
//var handleError = require('../lib/pos_modules/errorHandling');
//var savePaymentInDB = require('../lib/pos_modules/transactionSave');
//
//
//router.get('/', function(req, res) {
//  Transaction.find(function(err, transactions) {
//    if (err)
//      res.send(err);
//
//    res.json(transactions);
//  });
//});
//
//router.post('/', function(req, res) {
//    console.log("Post received with content type of", req.headers['content-type']);
//    var statusObject = {isOK: true, success: []};
//    var paymentDTO = {};
//
//    if (statusObject.isOK) {
//        checkcPostToken(req, statusObject, continuePost);
//    }
//
//    function continuePost(err, statusObject) {
//        if (err) handleError(err, req, res);
//        console.log("Token Matched");
//
//        if (statusObject.isOK) createPaymentDTO(req, res, statusObject);
//        console.log("Payment DTO Created");
//
//        //if (statusObject.isOK) validatePayment(paymentDTO, statusObject);
//        //console.log("Passed Validations");
//
//        if (statusObject.isOK) mapPayment(paymentDTO, statusObject);
//        console.log("Payment Saved in DB");
//
//        if (statusObject.isOK) savePaymentInDB(paymentDTO, statusObject);
//        console.log("Payment Saved in DB");
//
//        sendResponse(req, res, statusObject);
//        console.log("Request Sent");
//
//    }
//
//});
//
//
//module.exports = router;
