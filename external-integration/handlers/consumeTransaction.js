var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var configPlugin = require('posable-customer-config-plugin');
var invoiceMerchantSearch = require('../lib/common/merchantSearch');
var invoicePersistence = require('../lib/invoiceJob/invoicePersistence');

var testingStub = function(testLogPlugin, testDispose) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testDispose;
};

var handleError = function(msg, err){
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleTransaction = function(msg) {
    try {
        logPlugin.debug('Starting Transaction Handler');
        var id = msg.body.internalID;
        var merchantLookupCallback = function(err, merchant) {
            if (merchant.accountingIsReady === false) {
                logPlugin.debug('Merchant Data Not ready for External Integration Accounting');
                return wascallyRabbit.rabbitDispose(msg);
            }
        };
        configPlugin.merchantLookup(id, merchantLookupCallback);

        invoiceMerchantSearch(id, function(err, merchant){
            if (err) {
                // Error connecting to database, retry with error
                handleError(msg, err);
            } else {
                // Sending to invoicePersistence Map
                invoicePersistence(msg, merchant);
            }
        });

    } catch(err) {
        handleError(msg, err);
    }
};

module.exports = {
    handleTransaction: handleTransaction,
    testingStub: testingStub
};
