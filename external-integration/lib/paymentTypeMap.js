var salesReceipt = require('./realTimeTransactionMap');
var merchant;
var configPlugin = require('posable-customer-config-plugin');


var paymentTypeMap = function(msg) {

        try {
            var paymentTypes = {};
            var id = msg.body.internalID;
            configPlugin.merchantLookup(id, function(err, merchant){

                paymentTypes.visaID = merchant.visaID;
                paymentTypes.mastercardID = merchant.mastercardID;
                paymentTypes.amexID = merchant.amexID;
                paymentTypes.discoverID = merchant.discoverID;

                console.log("ok", paymentTypes);

            });



        } catch (err) {
            console.log(err);
        }

};

module.exports = paymentTypeMap;