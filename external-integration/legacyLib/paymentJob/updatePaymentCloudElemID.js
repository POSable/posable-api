var logPlugin = require('posable-logging-plugin');
var Payment = require('../../models/payment').model;


var updatePaymentCloudElemID = function(paymentID, qbPaymentID) {

    try {
        Payment.findOneAndUpdate(
            {
                _id: paymentID},
            {
                $set:
                {
                    cloudElemID: qbPaymentID
                }
            },
            {
                new: true
            },
            function(err, doc) {
                if (err) {
                    logPlugin.error("The payment update response Error from mongo is : " + err);
                }else {
                    logPlugin.debug("The payment has been successfully updated with the CloudElemID: " + JSON.stringify(doc.cloudElemID));
                }
            }

        )

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = updatePaymentCloudElemID;