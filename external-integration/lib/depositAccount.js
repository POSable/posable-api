var depositAccount = function(merchant) {

    var depositDetails = {};

    depositDetails.depositAccountID = merchant.depositAccountID;
    depositDetails.depositAccountName = merchant.depositAccountName;

    //console.log("ok", depositDetails);

    return depositDetails;

};

module.exports = depositAccount;