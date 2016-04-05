var logPlugin = require('posable-logging-plugin');
var Invoice = require('../../models/invoice').model;


var updateInvoiceCloudElemID = function(internalInvoiceID, extPostID) {

    try {
        Invoice.findOneAndUpdate(
            {
                _id: internalInvoiceID},
            {
                $set:
                    {
                        extPostID:  extPostID
                    }
            },
            {
                new: true
            },
            function(err, doc) {
                if (err) {
                    logPlugin.error("The invoice update response Error from mongo is : " + err);
                }else {
                    logPlugin.debug("The invoice has been successfully updated with the extPostID : " + JSON.stringify(doc.extPostID));
                }
            }
        )
    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = updateInvoiceCloudElemID;
