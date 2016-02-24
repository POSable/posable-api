var qbBatchRequestMap = require('./quickbooks/qbBatchRequestMap');
var xeroBatchRequestMap = require('./xero/xeroBatchRequestMap');

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