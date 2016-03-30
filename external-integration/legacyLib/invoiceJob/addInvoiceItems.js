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
    var taxTotal = 0;
    msg.body.data.taxes.forEach(function(tax) {
        taxTotal += tax.taxAmount;
    });
    if(taxTotal > 0) {
        var taxInvoiceItem = new InvoiceItem();
        taxInvoiceItem.transactionID = msg.body.data.transactionID;
        taxInvoiceItem.type = "tax";
        taxInvoiceItem.amount = taxTotal;
        invoice.invoiceItems.push(taxInvoiceItem);
    }
};
var addDiscountItem = function(msg, invoice) {
    var discountTotal = 0;
    msg.body.data.discounts.forEach(function(discount) {
        discountTotal += discount.discountAmount;
    });
    if(discountTotal > 0) {
        var discountInvoiceItem = new InvoiceItem();
        discountInvoiceItem.transactionID = msg.body.data.transactionID;
        discountInvoiceItem.type = "discount";
        discountInvoiceItem.amount = discountTotal;
        invoice.invoiceItems.push(discountInvoiceItem);
    }
};
var addGiftCardItem = function(msg, invoice) {
    var giftPayments = [];
    var giftTotal = 0;
    msg.body.data.transactionPayments.forEach(function(payment) {
        if (payment.paymentType === "Gift") {
            giftPayments.push(payment);
        }
    });
    giftPayments.forEach(function(giftPay) {
        giftTotal += giftPay.amount;
    });
    if(giftTotal > 0) {
        var giftCardInvoiceItem = new InvoiceItem();
        giftCardInvoiceItem.transactionID = msg.body.data.transactionID;
        giftCardInvoiceItem.type = "giftCard";
        giftCardInvoiceItem.amount = giftTotal;
        invoice.invoiceItems.push(giftCardInvoiceItem);
        console.log(invoice);
    }
};

var addInvoiceItems = function(msg, foundInvoice) {
    try {
        addSaleItem(msg, foundInvoice);
        addTaxItem(msg, foundInvoice);
        addDiscountItem(msg, foundInvoice);
        addGiftCardItem(msg, foundInvoice);
    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = addInvoiceItems;





