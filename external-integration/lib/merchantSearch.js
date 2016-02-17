var logPlugin = require('posable-logging-plugin');
var node_env = process.env.NODE_ENV || 'development';
var env = require('../common').config();
var envReddisPath;
// this is a work around for local machines without reddis installed.
if (process.env.NODE_ENV !== 'development') {
    envReddisPath = "";
} else {
    envReddisPath = env['redis_connection']
}

var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection'], envReddisPath, logPlugin);

var merchantSearch = function(id, callback) {
    var searchError = undefined;

    // Initial ID Check

    if (id === undefined) {
        var idError = new Error('Msg internalID is undefined.  Msg rejected from RTT handler');
        return callback(idError); // Stops procedure for invalid ID
    }

    configPlugin.merchantLookup(id, function(err, merchant) {
        if (err) {
            logPlugin.error(err);
            searchError = err;
        } else if (merchant === null) {
            searchError = new Error('Merchant NOT found');
            searchError.deadLetter = true;
        } else {
            logPlugin.debug('Merchant found, search complete')
        }

        return callback(searchError, merchant);
    });
};

module.exports = merchantSearch;