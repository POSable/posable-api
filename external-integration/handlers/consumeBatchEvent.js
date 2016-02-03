var batchRequestMap = require('../lib/batchRequestMap');
var merchantSearch = require('../lib/merchantSearch');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');


//var testingStub = function(testLodPlugin, testDispose, testConfigPlugin, testPost) {
//    logPlugin = testLodPlugin;
//    wascallyRabbit = testDispose;
//    env = {};
//    configPlugin = testConfigPlugin;
//    cardTypeMap = function () {};
//    depositAccount = function () {};
//    batchMap = function () {return {}};
//    post = testPost;
//};

var handleSyncError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleBatch = function(msg) {

    var id = msg.body.internalID;

    merchantSearch(id, function(err, merchant){

        if(err) {
            wascallyRabbit.rabbitDispose(msg, err);
        } else {
            batchRequestMap(msg, merchant);
        }
    });
};

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

    handleBatch: handleBatch
    //testingStub: testingStub

};
