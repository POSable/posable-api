var logPlugin = require('posable-logging-plugin');

var createTransactionDTO = function (req, statusObject) {
    try {
        logPlugin.debug('Starting Transaction Request Mapping');
        var transactionDTO = {};
        if (req.headers['content-type'] === "application/json" || req.headers['content-type'] === "application/xml") {
            // the following adjust the xml-parsed body
            if (req.headers['content-type'] === "application/xml") {
                if (reqBodyIsEmpty()) return transactionDTO;
                transactionDTO = req.body;
                transactionDTO.transaction.payments = transactionDTO.transaction.payments.payment;
                //in xml a single payment will not be parsed into an array. This is forced below.
                if (Object.prototype.toString.call(transactionDTO.transaction.payments) === '[object Object]') {
                    transactionDTO.transaction.payments = [transactionDTO.transaction.payments];
                }
            } else {
                if (reqBodyIsEmpty()) return transactionDTO;
                transactionDTO = req.body;
            }
            statusObject.success.push("createTransactionDTO");
        } else {
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "Cannot read content-type in headers"}
            }
        }
        logPlugin.debug('Transaction Request Mapping Finished');
        return transactionDTO;
    } catch (err) {
        if (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 500, message: "System error processing transaction"}
            }
        }
    }

    function reqBodyIsEmpty() {

        if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
            var err = new Error('Missing request body');
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "Missing request body"}
            };
            return true;
        }
    }
};

module.exports = createTransactionDTO;