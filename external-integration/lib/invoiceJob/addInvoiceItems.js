var logPlugin = require('posable-logging-plugin');
var InvoiceItem = require('../../models/invoiceItem').model;

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
    //foreach these out
    if(msg.body.data.taxes.tax.taxamount > 0) {
        var taxInvoiceItem = new InvoiceItem();
        taxInvoiceItem.transactionID = msg.body.data.transactionID;
        taxInvoiceItem.type = "tax";
        taxInvoiceItem.amount = msg.body.data.tax;
        invoice.invoiceItems.push(taxInvoiceItem);
    }
};
var addDiscountItem = function(msg, invoice) {
    //foreach these out, also these should be negative
    if(msg.body.data.discounts.discount.discountamount > 0) {
        var discountInvoiceItem = new InvoiceItem();
        discountInvoiceItem.transactionID = msg.body.data.transactionID;
        discountInvoiceItem.type = "discount";
        discountInvoiceItem.amount = msg.body.data.amount;
        invoice.invoiceItems.push(discountInvoiceItem);
    }
};
var addGiftCardItem = function(msg, invoice) {
    //foreach these out, also these should be negative and make sure paymentType is gift
    //msg.body.data.transactionPayments.forEach();
    if(msg.body.data.transactionPayments.paymentType === 'Gift') {
        var giftCardInvoiceItem = new InvoiceItem();
        giftCardInvoiceItem.transactionID = msg.body.data.transactionID;
        giftCardInvoiceItem.type = "giftCard";
        giftCardInvoiceItem.amount = msg.body.data.amount;
        invoice.invoiceItems.push(giftCardInvoiceItem);
    }
};

var addInvoiceItems = function(msg, foundInvoice) {
    try {

        addSaleItem(msg, foundInvoice);
        //addTaxItem(msg, foundInvoice);
        //addDiscountItem(msg, foundInvoice);
        //addGiftCardItem(msg, foundInvoice);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = addInvoiceItems;





