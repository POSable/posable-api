var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var merchantSearch = require('../lib/merchantSearch');
var invoiceProcedureMap = require('../lib/invoiceProcedureMap');

var testingStub = function(testLogPlugin, testDispose) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testDispose;
};

var handleError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleTransaction = function(msg) {
    try {
        logPlugin.debug('Starting Transaction Handler');
        var id = msg.body.internalID;

        merchantSearch(id, function(err, merchant){
            if (err) {
                // Error connecting to database, retry with error
                handleError(msg, err);
            } else {
                // Sending to invoiceProcedureMap Map
                invoiceProcedureMap(msg, merchant);
            }
        });

    } catch(err) {
        handleError(msg, err);
        throw err;
    }
};

module.exports = {
    handleTransaction: handleTransaction,
    testingStub: testingStub
};
