var batchRequestMap = require('../lib/batchRequestMap');
var merchantSearch = require('../lib/merchantSearch');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');

<<<<<<< HEAD
var testingStub = function(testLodPlugin, testDispose, testConfigPlugin, testPost) {
=======
var testingStub = function(testLodPlugin, testDispose, testConfigPlugin, testBatchRequestMap) {
>>>>>>> 6f2d93aa08709d5c7b01be9cd23f27326fdbe40a
    logPlugin = testLodPlugin;
    wascallyRabbit = testDispose;
    merchantSearch = testConfigPlugin.merchantSearch;
    batchRequestMap = testBatchRequestMap;
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
                batchRequestMap(msg, merchant);
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
