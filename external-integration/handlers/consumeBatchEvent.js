var batchMap = require('../lib/batchMap');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var cardTypeMap = require('../lib/cardTypeMap');
var depositAccount = require('../lib/depositAccount');
var post = require('../lib/cloudElementsClient');
var wascallyRabbit = require('posable-wascally-wrapper');

var handleSyncError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleBatch = function(msg) {
    var id = msg.body.internalID;
    if(id == undefined){
        var idErr = new Error('Msg internalID is undefined.  Msg is rejected from Batch msg Handler');
        handleSyncError(msg, idErr);
    } else {
        logPlugin.debug("Found Internal ID : " + id);
        configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {
            if (err) {
                handleSyncError(msg, err);
            } else {
                logPlugin.debug('Merchant Lookup finished');
                processBatch(merchant)
            }
        });
    }

    function processBatch(merchant){
        try {
            //console.log(merchant);
            if (merchant == undefined) throw new Error("Merchant not found");
            if (merchant.batchType === "batch") {
                logPlugin.debug("batch merchant found");

                var typeMap = cardTypeMap(merchant);

                var depositObj = depositAccount(merchant);

                var cloudElemSR = batchMap(msg, typeMap, depositObj);

                postBatchToCE(cloudElemSR, merchant);

            } else {
                logPlugin.debug("Batch merchant not found");
                wascallyRabbit.rabbitDispose(msg, err);
            }
        } catch(err) {
            handleSyncError(msg, err);
        }
    }

    function postBatchToCE(cloudElemSR, merchant){
        post(cloudElemSR, merchant, function (err, salesReceipt) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug("the msg made it through post and ack");
            }
            wascallyRabbit.rabbitDispose(msg, err);
        });
    }





};

module.exports = {

    handleBatch: handleBatch

};