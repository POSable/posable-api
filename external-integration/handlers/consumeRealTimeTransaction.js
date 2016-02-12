var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var merchantSearch = require('../lib/merchantSearch');
var accountingMap = require('../lib/accountingMap');

var testingStub = function(testLodPlugin, testDispose) {
    logPlugin = testLodPlugin;
    wascallyRabbit = testDispose;
    requestMap = function () {};
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

            if(err) {
                wascallyRabbit.rabbitDispose(msg, err);
            } else {

                if(merchant.batchType === 'batch') {
                    wascallyRabbit.rabbitDispose(msg, err);
                } else {

                    accountingMap(msg, merchant);
                }
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
