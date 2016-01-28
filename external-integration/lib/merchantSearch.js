var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

var merchantSearch = function(id, callback) {
    var searchError = undefined;

    configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {
        if (err) {
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