var qbRequestMap = require('./quickbooks/qbRequestMap');
var xeroRequestMap = require('./xero/xeroRequestMap');

var accountingMap = function(msg, merchant) {

    if (merchant.accountingClient === 'quickbooks') {
        qbRequestMap(msg, merchant);
    } else if (merchant.accountingClient === 'xero') {
        xeroRequestMap(msg, merchant);
    } else {

        //    do something with msg when accountingClient is not found
    }
};

module.exports = accountingMap;