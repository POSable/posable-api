var logPlugin = require('posable-logging-plugin');

var createTransactionDTO = function (req, statusObject) {
    var transactionDTO = {};
    try {
        if (req.headers['content-type'] === "application/json" || req.headers['content-type'] === "application/xml") {
            // the following adjust the xml-parsed body
            if (req.headers['content-type'] === "application/xml") {
                transactionDTO = req.body;
                transactionDTO.transaction.payments = transactionDTO.transaction.payments.payment;
            } else {
                transactionDTO = req.body;
            }
            statusObject.success.push("createTransactionDTO");
        } else {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: 'createTransactionDTO',
                error: {code: 400, message: "Payment DTO was not successfully created from Post Body"}
            }
        }
    } catch (err) {
        if (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "createTransactionDTO",
                error: {code: 500, message: "System Error with creating a Transaction DTO"}
            }
        }
        return transactionDTO;
    }
    return transactionDTO;
};

module.exports = createTransactionDTO;
