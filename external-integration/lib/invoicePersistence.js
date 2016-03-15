var InvoiceItem = require('../models/invoiceItem').model;
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var invoicePersistence = function(msg) {
    try {
        logPlugin.debug('Starting InvoiceItem Mapping');
        var invoiceItem = new InvoiceItem();

        invoiceItem.transactionID = msg.correlationId;
        invoiceItem.type = msg.correlationId;
        invoiceItem.amount = msg.correlationId;

        invoiceItem.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('InvoiceItem was saved');
            }
            wascallyRabbit.rabbitDispose(msg, err);
        });

    } catch (err) {
        logPlugin.debug('System error in invoicePersistence');
        logPlugin.error(err);
        return undefined;
    }
    logPlugin.debug('invoicePersistence Mapping Finished');
    return invoiceItem;
};

module.exports = invoicePersistence;