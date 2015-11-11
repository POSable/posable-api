var connection = require('./messageClient').getWascally;
var statusObject;

var publishObject = function(exchange, type, payload, key) {
    try {
        console.log("in publish");
        connection.publish(exchange, type, payload, key);
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with publishing object to Rabbit"}
            };
            console.log(err);
        }
    }
};

var addLogEntry = function(payload) {
    try {
        console.log("setting arguments for logging entry");
        publishObject ('all-commands', 'logger.command.addLogEntry', payload, 'service.logging');
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with setting arguments for addLogEntry function"}
            };
            console.log(err);
        }
    }
};

var addTransactionEntry = function(payload) {
    try {
        console.log("setting arguments for transaction entry");
        publishObject ('posapi.event.receivedCreateTransactionRequest', 'posapi.event.receivedCreateTransactionRequest', payload);
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with setting arguments for addTransactionEntry function"}
            };
            console.log(err);
        }
    }
};

var addPaymentEntry = function(payload) {
    try {
        console.log("setting arguments for payment entry");
        publishObject('posapi.event.receivedCreatePaymentRequest', 'posapi.event.receivedCreatePaymentRequest', payload);
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with setting arguments for addPaymentEntry function"}
            };
            console.log(err);
        }
    }
};

module.exports = {
    addLogEntry: addLogEntry,
    addTransactionEntry: addTransactionEntry,
    addPaymentEntry: addPaymentEntry
};