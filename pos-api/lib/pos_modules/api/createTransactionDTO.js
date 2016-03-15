var logPlugin = require('posable-logging-plugin');

var createTransactionDTO = function (req, statusObject) {
    try {
        logPlugin.debug('Starting Transaction Request Mapping');
        var transactionDTO = {};
        var contentType = req.headers['content-type'];

        if (reqBodyIsEmpty()) {return transactionDTO;}  // <-- Stops procedure for empty posts
        if (contentType !== "application/xml" && contentType !== "application/json") {  // <-- Stops procedure for missing content-type
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "Cannot read content-type in headers"}
            };
            return transactionDTO;
        }
        transactionDTO = req.body;
        if (contentType === "application/xml") {
            var xmlPayments = transactionDTO.Transaction.Payments.Payment;
            if (xmlPayments.length > 1) { transactionDTO.Transaction.Payments = xmlPayments; }
            else { transactionDTO.Transaction.Payments = [xmlPayments]; }}  // <-- forces single xml payments into array
        statusObject.success.push("createTransactionDTO");
        logPlugin.debug('Transaction Request Mapping Finished');

        return transactionDTO;  // <-- return raw DTO for mapping

    } catch (err) {
        logPlugin.error(err);
        statusObject.isOK = false;
        statusObject['error'] = {
            error: {code: 500, message: "System error processing transaction"}
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