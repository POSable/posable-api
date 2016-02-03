var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');
var merchantSearch = require('../lib/merchantSearch');
var requestMap = require('../lib/requestMap');

var handleRealTimeTransaction = function(msg) {
    try {
        var id = msg.body.internalID;

        merchantSearch(id, function(err, merchant){

            if(err) {
                wascallyRabbit.rabbitDispose(msg, err);
            } else {
                if(merchant.batchType === 'batch') {
                    wascallyRabbit.rabbitDispose(msg, err);
                } else {
                    requestMap(msg, merchant);
                }
            }
        });

    } catch(err) {
        handleError(msg, err);
        throw err;
    }
};

module.exports = {
    handleRealTimeTransaction: handleRealTimeTransaction
    //testingStub: testingStub
};
