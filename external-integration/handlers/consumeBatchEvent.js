var accountingBatchMap = require('../lib/accountingBatchMap');
var merchantSearch = require('../lib/merchantSearch');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');

var testingStub = function(testLodPlugin, testDispose, testConfigPlugin, testAccountingBatchMap) {
    logPlugin = testLodPlugin;
    wascallyRabbit = testDispose;
    merchantSearch = testConfigPlugin.merchantSearch;
    accountingBatchMap = testAccountingBatchMap;
};

var handleSyncError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleBatch = function(msg) {
    try {

        logPlugin.debug('Starting handleBatch Module');
        var id = msg.body.internalID;
        logPlugin.debug("Found Internal ID : " + id);
        merchantSearch(id, function(err, merchant){
            if(err) {
                wascallyRabbit.rabbitDispose(msg, err);
            } else {
                logPlugin.debug('Merchant search finished');
                accountingBatchMap(msg, merchant);
            }
        });
    } catch(err) {
        err.deadLetter = true;
        handleSyncError(msg, err);
        throw err;
    }
};

module.exports = {

    handleBatch: handleBatch,
    testingStub: testingStub

};
