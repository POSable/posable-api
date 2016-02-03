var batchRequestMap = require('../lib/batchRequestMap');
var merchantSearch = require('../lib/merchantSearch');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');

var handleSyncError = function(msg, err){
    err.deadLetter = true;
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

module.exports = {

    handleBatch: handleBatch

};