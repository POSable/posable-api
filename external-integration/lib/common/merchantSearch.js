var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')();


var merchantSearch = function(id, callback) {
    var searchError = undefined;

    // Initial ID Check
    if (id === undefined) {
        var idError = new Error('Msg internalID is undefined.  Msg rejected from RTT handler');
        return callback(idError, null); // Stops procedure for invalid ID
    }

    configPlugin.merchantInvoiceConfig(id, function(err, merchant) {
        if (err) {
            // Error connecting to database, exit with error
            logPlugin.error(err);
            searchError = err;
            return callback(searchError, null);
        } else if (merchant === null) {
            // No merchant record found, deadLetter msg
            searchError = new Error('Merchant NOT found');
            searchError.deadLetter = true;
            return callback(searchError, merchant);
        } else {
            logPlugin.debug('Merchant found, search complete');
            return callback(null, merchant);
        }
    });
};

module.exports = merchantSearch;