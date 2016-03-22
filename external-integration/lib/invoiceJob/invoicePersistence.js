var InvoiceItem = require('../../models/invoiceItem').model;
var Invoice = require('../../models/invoice').model;
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var makePayments = require('./../paymentJob/makePayments');

var populateInvoice = function(invoice, id, batchTime) {
    invoice.cloudElemID = null;
    invoice.internalID = id;
    invoice.finalizeAt = batchTime;
    invoice.invoiceItems = [];
};
var addSaleItem = function(msg, invoice) {
    if(msg.body.data.amount > 0) {
        var saleInvoiceItem = new InvoiceItem();
        saleInvoiceItem.transactionID = msg.body.data.transactionID;
        saleInvoiceItem.type = "sale";
        saleInvoiceItem.amount = msg.body.data.amount;
        invoice.invoiceItems.push(saleInvoiceItem);
    }
};
var addTaxItem = function(msg, invoice) {
    if(msg.body.data.tax > 0) {
        var taxInvoiceItem = new InvoiceItem();
        taxInvoiceItem.transactionID = msg.body.data.transactionID;
        taxInvoiceItem.type = "tax";
        taxInvoiceItem.amount = msg.body.data.tax;
        invoice.invoiceItems.push(taxInvoiceItem);
    }
};
var addDiscountItem = function(msg, invoice) {
    if(msg.body.data.amount > 0) {          //need dataModel    <---------------------- Need to map at POS-API level
        var discountInvoiceItem = new InvoiceItem();
        discountInvoiceItem.transactionID = msg.body.data.transactionID;
        discountInvoiceItem.type = "discount";
        discountInvoiceItem.amount = msg.body.data.amount; //need dataModel
        invoice.invoiceItems.push(discountInvoiceItem);
    }
};
var addGiftCardItem = function(msg, invoice) {
    if(msg.body.data.paymentType === 'gift') {
        var giftCardInvoiceItem = new InvoiceItem();
        giftCardInvoiceItem.transactionID = msg.body.data.transactionID;
        giftCardInvoiceItem.type = "giftCard";
        giftCardInvoiceItem.amount = msg.body.data.amount; //need dataModel
        invoice.invoiceItems.push(giftCardInvoiceItem);
    }
};
var addInvoiceItems = function(msg, foundInvoice) {
    addSaleItem(msg, foundInvoice);
    addTaxItem(msg, foundInvoice);
    addDiscountItem(msg, foundInvoice);
    addGiftCardItem(msg, foundInvoice);
};
var invoiceSaveAndMsgDispose = function(msg, foundInvoice) {
    foundInvoice.save(function (err) {
        if (err) {
            logPlugin.error(err);
        } else {
            logPlugin.debug('Invoice was saved');
        }
        wascallyRabbit.rabbitDispose(msg, err);
    });
};
function getInvoice(id){
    Invoice.findOne(
        {
            internalID: id,
            finalizeAt:
            {
                $gt: new Date()
            },
            cloudElemID: null
        },
        {},
        function(err, result) {
            if( err ) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Invoice findOne complete. Results : ', result);
            }
        }
    );
}

var invoicePersistence = function(msg, merchant) {
    try {
        logPlugin.debug('Starting InvoiceItem Mapping');

        var foundInvoice = null;
        var finalizeAt = Date.now(); //if real time, never gets over-ridden
        var id = merchant.internalID;
        var batchTime = merchant.batchTime;

        if (merchant.batchType === "batch") {
            finalizeAt = batchTime; //override this to merchant's batch time so the invoice stays open

            //if batch merchant's invoice already open for day, edit existing
            //This will be async and need to be put into a callback...
            foundInvoice = getInvoice(id);
        }

        if (!foundInvoice) {
            //either realtime merch or batch merch's first transaction
            foundInvoice = new Invoice();
            populateInvoice(foundInvoice, id, finalizeAt);
        }

        //set all line item functions on either new or found (db) invoice
        addInvoiceItems(msg, foundInvoice);     //Why are invoiceItems not being shoved into array?
        makePayments(msg, foundInvoice);
        invoiceSaveAndMsgDispose(msg, foundInvoice);

    } catch (err) {
        logPlugin.debug('System error in invoicePersistence');
        logPlugin.error(err);
    }

    logPlugin.debug('invoicePersistence Procedure Finished');

};

module.exports = invoicePersistence;