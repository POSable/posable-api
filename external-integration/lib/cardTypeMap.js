//var salesReceipt = require('./realTimeTransactionMap');

var cardTypeMap = function(merchant) {

    var paymentTypes = {};

    paymentTypes.visaID = merchant.visaID;
    paymentTypes.mastercardID = merchant.mastercardID;
    paymentTypes.amexID = merchant.amexID;
    paymentTypes.discoverID = merchant.discoverID;

    //console.log(paymentTypes);

    return paymentTypes;

};

module.exports = cardTypeMap;