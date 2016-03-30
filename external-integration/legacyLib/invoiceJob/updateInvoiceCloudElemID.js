var logPlugin = require('posable-logging-plugin');
var Invoice = require('../../models/invoice').model;


var updateInvoiceCloudElemID = function(invoiceID, externalPostID) {

    try {
        Invoice.findOneAndUpdate(
            {
                _id: invoiceID},
            {
                $set:
                    {
                        cloudElemID: externalPostID
                    }
            },
            {
                new: true
            },
            function(err, doc) {
                if (err) {
                    logPlugin.error("The invoice update response Error from mongo is : " + err);
                }else {
                    logPlugin.debug("The invoice has been successfully updated with the CloudElemID: " + JSON.stringify(doc.cloudElemID));
                }
            }

        )

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = updateInvoiceCloudElemID;
