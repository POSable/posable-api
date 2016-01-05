var salesReceipt = require('./realTimeTransactionMap');

var depositAccount = function(merchant) {

    try {
        var depositDetails = {};

            depositDetails.depositAccountID = merchant.depositAccountID;
            depositDetails.depositAccountName = merchant.depositAccountName;

            //console.log("ok", depositDetails);

            return depositDetails;

    } catch (err) {
        console.log(err);
    }

};

module.exports = depositAccount;