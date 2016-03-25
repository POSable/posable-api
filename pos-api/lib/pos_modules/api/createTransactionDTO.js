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

        if (contentType === "application/json") { transactionDTO = keysToLowerCase(req.body); }

        if (contentType === "application/xml") {
            transactionDTO = req.body;

            var xmlPayments = transactionDTO.transaction.payments.payment;
            var xmlTaxes = transactionDTO.transaction.taxes.tax;
            var xmlDiscounts = transactionDTO.transaction.discounts.discount;

            if (xmlPayments.length > 1) { transactionDTO.transaction.payments = xmlPayments; }
            else { transactionDTO.transaction.payments = [xmlPayments]; }  // <-- forces single xml payments into array

            if (xmlTaxes.length > 1) { transactionDTO.transaction.taxes = xmlTaxes; }
            else { transactionDTO.transaction.taxes = [xmlTaxes]; }  // <-- forces single xml taxes into array

            if (xmlDiscounts.length > 1) { transactionDTO.transaction.discounts = xmlDiscounts; }
            else { transactionDTO.transaction.discounts = [xmlDiscounts]; }  // <-- forces single xml discounts into array
        }

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
    // Formats all JSON keys to lowercase
    function keysToLowerCase (obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (obj[key] instanceof Object) { keysToLowerCase(obj[key]); }
            if (key !== key.toLowerCase()) {
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        }
        return obj;
    }
};

module.exports = createTransactionDTO;