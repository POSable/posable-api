var depositAccount = function(merchant) {

    var depositDetails = {};

    depositDetails.accountID = merchant.depositAccountID;
    depositDetails.name = merchant.depositAccountName;

    //console.log("ok", depositDetails);

    return depositDetails;

};

module.exports = depositAccount;