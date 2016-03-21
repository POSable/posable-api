var invoiceProcedure = require('./invoiceProcedure');
var logPlugin = require('posable-logging-plugin');
var Invoice = require('../../models/invoice').model;

var invoiceQuery = function() {
    try {
    //    Write Invoice find for any that are past finalizeAt time
    //    and kickoff invoiceProcedure(invoiceToBeBatched) forEach

        Invoice.find({})

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = invoiceQuery;
