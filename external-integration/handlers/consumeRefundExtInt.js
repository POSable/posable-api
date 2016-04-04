var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var refundMerchantSearch = require('../lib/common/merchantSearch');
var refundPersistence = require('../lib/refundJob/refundPersistence');

var deadLetterErrorHandling = function (msg, err) {
    logPlugin.error(err);
    err.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};


function consumeRefundExtInt(msg) {
    try {
        logPlugin.debug('Starting refund handler');
        var id = msg.body.internalID;

        refundMerchantSearch(id, function(err, merchant){
            if (err) {
                // Error searching to database, retry
                handleError(msg, err);
            } else {
                // Merchant found, sending to persistence
                refundPersistence(msg, merchant, function(err) {
                    if (err) {
                        // Error saving to database, retry
                        handleError(msg, err);
                    } else {
                        // Refund saved, ack message
                        logPlugin.debug('Refund handler finished');
                        wascallyRabbit.rabbitDispose(msg, null);
                    }
                });
            }
        });

    } catch(err) {
        deadLetterErrorHandling(msg, err);
    }
}

module.exports = {
    consumeRefundExtInt: consumeRefundExtInt
    //testingStub: testingStub
};

