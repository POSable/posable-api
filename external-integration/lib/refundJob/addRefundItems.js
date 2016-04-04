var logPlugin = require('posable-logging-plugin');
var RefundItem = require('../../models/refundItem').model;

var addSaleItem = function(msg, refund) {
    if (msg.body.data.subtotal > 0) {
        var saleRefundItem = new RefundItem();
        saleRefundItem.transactionID = msg.body.data.transactionID;
        saleRefundItem.type = "sales";
        saleRefundItem.amount =  msg.body.data.subtotal;
        refund.refundItems.push(saleRefundItem);
    }
};

var addTaxItem = function(msg, refund) {
    var taxTotal = 0;
    msg.body.data.taxes.forEach(function(tax) {
        taxTotal += parseFloat(tax.taxAmount);
    });
    if (taxTotal > 0) {
        var taxRefundItem = new RefundItem();
        taxRefundItem.transactionID = msg.body.data.transactionID;
        taxRefundItem.type = "tax";
        taxRefundItem.amount = taxTotal;
        refund.refundItems.push(taxRefundItem);
    }
};

var addDiscountItem = function(msg, refund) {
    var discountTotal = 0;
    msg.body.data.discounts.forEach(function(discount) {
        discountTotal += parseFloat(discount.discountAmount);
    });
    if (discountTotal > 0) {
        var discountRefundItem = new RefundItem();
        discountRefundItem.transactionID = msg.body.data.transactionID;
        discountRefundItem.type = "discount";
        discountRefundItem.amount = discountTotal;
        refund.refundItems.push(discountRefundItem);
    }
};

var addGiftCardItem = function(msg, refund) {
    var giftPayments = [];
    var giftTotal = 0;
    msg.body.data.transactionPayments.forEach(function(payment) {
        if (payment.paymentType.toLowerCase() === "gift") {
            giftPayments.push(payment);
        }
    });
    giftPayments.forEach(function(giftPay) {
        giftTotal += parseFloat(giftPay.amount);
    });
    if (giftTotal > 0) {
        var giftCardRefundItem = new RefundItem();
        giftCardRefundItem.transactionID = msg.body.data.transactionID;
        giftCardRefundItem.type = "gift";
        giftCardRefundItem.amount = giftTotal;
        refund.refundItems.push(giftCardRefundItem);
    }
};

var addRefundItems = function(msg, refund) {
    try {
        addSaleItem(msg, refund);
        addTaxItem(msg, refund);
        addDiscountItem(msg, refund);
        addGiftCardItem(msg, refund);
    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = addRefundItems;
