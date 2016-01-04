var salesReceipt = require('./realTimeTransactionMap');
var merchant;
var configPlugin = require('posable-customer-config-plugin');


var depositAccount = function(msg) {

    try {
        var depositDetails = {};
        var id = msg.body.internalID;
        configPlugin.merchantLookup(id, function(err, merchant){

            depositDetails.depositAccountID = merchant.depositAccountID;
            depositDetails.depositAccountName = merchant.depositAccountName;


            console.log("ok", depositDetails);

        });



    } catch (err) {
        console.log(err);
    }

};

module.exports = depositAccount;