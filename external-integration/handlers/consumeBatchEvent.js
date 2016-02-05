var batchMap = require('../lib/batchMap');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var cardTypeMap = require('../lib/cardTypeMap');
var depositAccount = require('../lib/depositAccount');
var post = require('../lib/cloudElementsClient');
var wascallyRabbit = require('posable-wascally-wrapper');

var testingStub = function(testLodPlugin, testDispose, testConfigPlugin, testPost) {
    logPlugin = testLodPlugin;
    wascallyRabbit = testDispose;
    env = {};
    configPlugin = testConfigPlugin;
    cardTypeMap = function () {};
    depositAccount = function () {};
    batchMap = function () {return {}};
    post = testPost;
};

var handleSyncError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleBatch = function(msg) {
    try {
        logPlugin.debug('Starting handleBatch Module');
        var id = msg.body.internalID;
        if(id === undefined){
            var idErr = new Error('Msg internalID is undefined. Msg is rejected from Batch msg Handler');
            idErr.deadLetter = true;
            handleSyncError(msg, idErr);
        } else {
            logPlugin.debug("Found Internal ID : " + id);
            configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {
                if (err) {
                    handleSyncError(msg, err);
                } else {
                    logPlugin.debug('Merchant lookup finished');
                    processBatch(merchant, msg);
                }
            });
        }
    } catch (err) {
        err.deadLetter = true;
        handleSyncError(msg, err);
        throw err
    }
};

function processBatch(merchant, msg){
    if (merchant === undefined) throw new Error("Merchant not found");
    if (merchant.batchType === "batch") {
        logPlugin.debug("Batch merchant found");

        var typeMap = cardTypeMap(merchant);
        var depositObj = depositAccount(merchant);
        var cloudElemSR = batchMap(msg, typeMap, depositObj);
        postBatchToCE(cloudElemSR, merchant, msg);

    } else {
        logPlugin.debug("Batch merchant not found");
        wascallyRabbit.rabbitDispose(msg, err);
    }
}

function postBatchToCE(cloudElemSR, merchant, msg){
    logPlugin.debug("Starting post to Cloud Elements");
    post(cloudElemSR, merchant, function (err, salesReceipt) {
        if (err) {
            logPlugin.error(err);
        } else {
            logPlugin.debug("Successful post to Cloud Elements");
        }
        wascallyRabbit.rabbitDispose(msg, err);
    });
}

module.exports = {

    handleBatch: handleBatch,
    testingStub: testingStub

};