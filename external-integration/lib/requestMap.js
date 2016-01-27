var cardTypeMap = require('./cardTypeMap');
var depositAccount = require('./depositAccount');
var realTimeTransactionMap = require('./realTimeTransactionMap');

var requestMap = function (msg, merchant) {
    // Create CE sales receipt (all sync)
    try {
        var type = cardTypeMap(merchant);
        var depositObj = depositAccount(merchant);
        var salesReceipt = realTimeTransactionMap(msg, type, depositObj);

        return salesReceipt;

    } catch (err) {
        throw err;
    }
};


module.exports = requestMap;