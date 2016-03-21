var invoiceProcedure = require('./invoiceProcedure');
var logPlugin = require('posable-logging-plugin');

var invoiceQuery = function() {
    try {
    //    Write Invoice find for any that are past finalizeAt time
    //    and kickoff invoiceProcedure(invoiceToBeBatched) forEach

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = invoiceQuery;
