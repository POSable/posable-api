var configPlugin = require('posable-customer-config-plugin');

var merchantConfigLookup = function() {
    configPlugin.merchantLookup(internalID, function (err, merchant) {

        try {


        } catch (err) {
            console.log(err);
        }

    });

};

module.exports = merchantConfigLookup();