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
    if( msg.body.data.subtotal > 0) {
        var saleInvoiceItem = new InvoiceItem();
        saleInvoiceItem.transactionID = msg.body.data.transactionID;
        saleInvoiceItem.type = "sale";
        saleInvoiceItem.amount =  msg.body.data.subtotal;
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
    if(msg.body.data.amount > 0) {          //need dataModel    <------------ Need to map at POS-API level
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
function getInvoice(id, callback){
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
                callback(err, null);
            } else {
                logPlugin.debug('Invoice findOne complete. Results : ', result);
                callback(null, result);
            }
        }
    );
}

var invoicePersistence = function(msg, merchant) {
    try {
        logPlugin.debug('Starting InvoiceItem Mapping');

        var foundInvoice = null;
        var id = merchant.internalID;

        if (merchant.batchType === "batch") {
            //if batch merchant's invoice already open for day, edit existing
            //This will be async and need to be put into a callback...
            getInvoice(id, function (err, foundInvoice) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    finishInvoice(foundInvoice);
                }
            })
        } else {
            finishInvoice(null);
        }
    } catch (err) {
        logPlugin.debug('System error in invoicePersistence');
        logPlugin.error(err);
    }

    function finishInvoice(invoice) {
        if (!foundInvoice) {
            //either realtime merch or batch merch's first transaction
            foundInvoice = new Invoice();
            var batchTime;
            if(merchant.batchType === "batch"){
                batchTime = calcTime(merchant);

            } else {
                batchTime = new Date();
            }
            populateInvoice(foundInvoice, id, batchTime);
        }

        //set all line item functions on either new or found (db) invoice
        addInvoiceItems(msg, foundInvoice);
        makePayments(msg, foundInvoice);
        invoiceSaveAndMsgDispose(msg, foundInvoice);
        logPlugin.debug('invoicePersistence Procedure Finished');
    }
};

var calcTime = function(merchant) {
    var batchTime;
    var dateNow = new Date();
    var testDate = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(), merchant.batchHour, merchant.batchMin);

    if(dateNow > testDate) {
        batchTime = testDate;
    } else {
        batchTime = testDate.setDate(testDate.getUTCDate() + 1);
    }
    console.log("#######", batchTime);
    return batchTime
};

module.exports = invoicePersistence;

//batchTime will be '20:15'  <---- fix this in UTC mil time
//Parse 20:15 into 'batchHour' (20) and 'batchMin (15)
//Set 'dtNow' = Date.now();
//set 'tstDate' as new Date(dtNow.getYear, dtNow.getMonth, dtNow.getDay, batchHour, batchMin);

// -- if tstDate now represents batch date/time for TODAY - if past it already, sset for tomorrow
//if Date.now() > tstDate
//tstDate = tstDate + 1 day
//return tstDate