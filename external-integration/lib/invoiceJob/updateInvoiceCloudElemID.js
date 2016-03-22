//var logPlugin = require('posable-logging-plugin');
//var Invoice = require('../../models/invoice').model;
//
//
//var updateInvoiceCloudElemID = function(response) {
//    try {
//        Invoice.update({_id: response}, //fix this
//            {
//                cloudElemID: response.headers['elements-request-id']
//            },
//            function(err, raw) {
//                if (err) {
//                    logPlugin.error("The batch update response Error from mongo is : " + err);
//                }else {
//                    logPlugin.debug("The invoice has been successfully updated with the CloudElemID: " + JSON.stringify(raw));
//                }
//            }
//        )
//
//    } catch (err) {
//        logPlugin.error(err);
//    }
//};
//
//module.exports = updateInvoiceCloudElemID;
