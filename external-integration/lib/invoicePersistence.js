var InvoiceItem = require('../models/invoiceItem').model;
var Invoice = require('../models/invoice').model;
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var newInvoice = function(id, batchTime) {
    var invoice = new Invoice();
    invoice.cloudElemID = null;
    invoice.internalID = id;
    invoice.finalizeAt = batchTime;
    invoice.invoiceItems = [];
    return invoice
};
var addSaleItem = function(msg, invoice) {
    var saleInvoiceItem = new InvoiceItem;
    saleInvoiceItem.transactionID = msg.body.data.transactionID;
    saleInvoiceItem.type = "sale";
    saleInvoiceItem.amount = msg.body.data.amount;
    invoice.invoiceItems.push(saleInvoiceItem);
};
var addTaxItem = function(msg, invoice) {
    var taxInvoiceItem = new InvoiceItem;
    taxInvoiceItem.transactionID = msg.body.data.transactionID;
    taxInvoiceItem.type = "tax";
    taxInvoiceItem.amount = msg.body.data.amount;
    invoice.invoiceItems.push(taxInvoiceItem);
};
var addDiscountItem = function(msg, invoice) {
    var discountInvoiceItem = new InvoiceItem;
    discountInvoiceItem.transactionID = msg.body.data.transactionID;
    discountInvoiceItem.type = "tax";
    discountInvoiceItem.amount = msg.body.data.amount;
    invoice.invoiceItems.push(discountInvoiceItem);
};
var addGiftCardItem = function(msg, invoice) {
    var giftCardInvoiceItem = new InvoiceItem;
    giftCardInvoiceItem.transactionID = msg.body.data.transactionID;
    giftCardInvoiceItem.type = "tax";
    giftCardInvoiceItem.amount = msg.body.data.amount;
    invoice.invoiceItems.push(giftCardInvoiceItem);
};
var invoiceSaveAndMsgDispose = function(msg, invoice) {
    invoice.save(function (err) {
        if (err) {
            logPlugin.error(err);
        } else {
            logPlugin.debug('Invoice was saved');
        }
        wascallyRabbit.rabbitDispose(msg, err);
    });
};

var invoicePersistence = function(msg, merchant) {
    try {
        logPlugin.debug('Starting InvoiceItem Mapping');

        var foundInvoice = null;
        var finalizeAt = Date.now();
        var id = merchant.internalID;
        var batchTime = merchant.batchTime;

        if(merchant.batchType === "batch") {
            finalizeAt = batchTime;
            foundInvoice = null; // Write the find query
            if(!foundInvoice) {
                newInvoice(id, finalizeAt);
                addSaleItem(msg, invoice);
                addTaxItem(msg, invoice);
                addDiscountItem(msg, invoice);
                addGiftCardItem(msg, invoice);
                invoiceSaveAndMsgDispose(msg, invoice)
            } else {
                //procedure for existing Invoice that needs InvoiceItems added to it
                addSaleItem(msg, foundInvoice);
                addTaxItem(msg, foundInvoice);
                addDiscountItem(msg, foundInvoice);
                addGiftCardItem(msg, foundInvoice);
                wascallyRabbit.rabbitDispose(msg, null);
            }
        } if(merchant.batchType === "real-time") {
            newInvoice(id, finalizeAt);
            addSaleItem(msg, invoice);
            addTaxItem(msg, invoice);
            addDiscountItem(msg, invoice);
            addGiftCardItem(msg, invoice);
            invoiceSaveAndMsgDispose(msg, invoice)

        } else {
            logPlugin.debug('batchType was not found in Invoice Persistence for InternalID : ', merchant.internalID);
            logPlugin.debug('Disposing of Msg');
            wascallyRabbit.rabbitDispose(msg, null);
        }

    } catch (err) {
        logPlugin.debug('System error in invoicePersistence');
        logPlugin.error(err);
        return undefined;
    }

    logPlugin.debug('invoicePersistence Procedure Finished');

};

module.exports = invoicePersistence;