var qbBatchRequestMap = require('./qbBatchRequestMap');
var xeroBatchRequestMap = require('./xeroBatchRequestMap');

var accountingBatchMap = function(msg, merchant) {

    if(merchant.accountingClient === 'quickbooks') {
        qbBatchRequestMap(msg, merchant);
    } if(merchant.accountingClient === 'xero') {
        xeroBatchRequestMap(msg, merchant);
    } else {
        //    do something with msg when accountingClient is not found
    }
};

module.exports = accountingBatchMap;