var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var checkPostToken = require ('../lib/pos_modules/authenticatePost');
//var uid = require('rand-token').uid;
var DTO = require('../lib/pos_modules/DTO');
var mapPayment = require('../lib/pos_modules/paymentMap');
var Payment = require('../models/payment');
var payment = new Payment();
var Val = require('../lib/pos_modules/validation');
var handleError = require('../lib/pos_modules/errorHandling');
var savePaymentInDB = require('../lib/pos_modules/paymentSave');
var sendResponse =require('../lib/pos_modules/sendResponse');


router.get('/', function(req, res) {
  Payment.find(function(err, payments) {
    if (err)
      res.send(err);

    res.json(payments);
  });
});

router.post('/', function(req, res) {
    console.log("Post received with content type of", req.headers['content-type']);
    var statusObject = {isOK: true, success: []};
    var newDTO = new DTO(req, res);

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

        if (statusObject.isOK) newDTO.createPaymentDTO(statusObject);

        var newVal = new Val(newDTO.paymentDTO.payment);
        if (statusObject.isOK) newVal.valPayment(statusObject);

        if (statusObject.isOK) mapPayment(newDTO.paymentDTO, payment, statusObject);

        if (statusObject.isOK) {
            savePaymentInDB(res, payment, statusObject, sendResponse);
        } else {
            sendResponse(res, statusObject)
        }

    }

});


module.exports = router;
