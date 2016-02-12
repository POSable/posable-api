var qbRequestMap = require('./qbRequestMap');
var xeroRequestMap = require('./xeroRequestMap');

var accountingMap = function(msg, merchant) {

    if(merchant.accountingClient === 'quickbooks') {
        qbRequestMap(msg, merchant);
    } if(merchant.accountingClient === 'xero') {
        xeroRequestMap(msg, merchant);
    } else {
    //    do something with msg when accountingClient is not found
    }
};

module.exports = accountingMap;