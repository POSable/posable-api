//var salesReceipt = require('./realTimeTransactionMap');

var cardTypeMap = function(merchant) {

        try {
            var paymentTypes = {};

                paymentTypes.visaID = merchant.visaID;
                paymentTypes.mastercardID = merchant.mastercardID;
                paymentTypes.amexID = merchant.amexID;
                paymentTypes.discoverID = merchant.discoverID;

                //console.log("ok", paymentTypes);

                return paymentTypes;

        } catch (err) {
            console.log(err);
        }

};

module.exports = cardTypeMap;