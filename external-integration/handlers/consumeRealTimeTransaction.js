var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var merchantSearch = require('../lib/merchantSearch');
var accountingMap = require('../lib/accountingMap');

var testingStub = function(testLogPlugin, testDispose) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testDispose;
};

var handleError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleRealTimeTransaction = function(msg) {
    try {
        logPlugin.debug('Starting Real Time Transaction Handler');
        var id = msg.body.internalID;

        merchantSearch(id, function(err, merchant){
            if (err) {
                // Error connecting to database, retry with error
                handleError(msg, err);
            } else if (merchant.batchType === 'batch') {
                // Merchant found but handler discards batch clients
                wascallyRabbit.rabbitDispose(msg, null);
            } else {
                // Real-time merchant found, map for sales receipt
                accountingMap(msg, merchant);
            }
        });

    } catch(err) {
        handleError(msg, err);
        throw err;
    }
};

module.exports = {
    handleRealTimeTransaction: handleRealTimeTransaction,
    testingStub: testingStub
};
