var InvoiceItem = require('../models/invoiceItem').model;
var Invoice = require('../models/invoice').model;
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var populateInvoice = function(invoice, id, batchTime) {
    invoice.cloudElemID = null;
    invoice.internalID = id;
    invoice.finalizeAt = batchTime;
    invoice.invoiceItems = [];
    return invoice
};
var addSaleItem = function(msg, invoice) {
    if(msg.body.data.amount > 0) {
        saleInvoiceItem.transactionID = msg.body.data.transactionID;
        saleInvoiceItem.type = "sale";
        saleInvoiceItem.amount = msg.body.data.amount;
        invoice.invoiceItems.push(saleInvoiceItem);
    }
};
var addTaxItem = function(msg, invoice) {
    if(msg.body.data.tax > 0) {
        taxInvoiceItem.transactionID = msg.body.data.transactionID;
        taxInvoiceItem.type = "tax";
        taxInvoiceItem.amount = msg.body.data.tax;
        invoice.invoiceItems.push(taxInvoiceItem);
    }
};
var addDiscountItem = function(msg, invoice) {
    if(msg.body.data.amount > 0) {          //need dataModel    <---------------------- Need to map at POS-API level
        discountInvoiceItem.transactionID = msg.body.data.transactionID;
        discountInvoiceItem.type = "tax";
        discountInvoiceItem.amount = msg.body.data.amount; //need dataModel
        invoice.invoiceItems.push(discountInvoiceItem);
    }
};
var addGiftCardItem = function(msg, invoice) {
    if(msg.body.data.paymentType === 'gift') {
        giftCardInvoiceItem.transactionID = msg.body.data.transactionID;
        giftCardInvoiceItem.type = "giftCard";
        giftCardInvoiceItem.amount = msg.body.data.amount; //need dataModel
        invoice.invoiceItems.push(giftCardInvoiceItem);
    }
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

        var invoice = new Invoice();

        if(merchant.batchType === "batch") {

            foundInvoice = null; // Write the find query

            if(!foundInvoice) {
                populateInvoice(invoice, id, batchTime);
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
            populateInvoice(invoice, id, finalizeAt);
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