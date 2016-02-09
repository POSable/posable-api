var jwt = require('jsonwebtoken');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

var authenticatePost = function (req, statusObject, callback) {
    try {
        logPlugin.debug('Starting authenticatePost Module');
        var internalErr = null;
        if (req.headers.jwtoken === null || req.headers.jwtoken === undefined) {

            var err = new Error('Missing json web token');
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "Missing json web token"}
            };
            return exitAuthPost(err, statusObject);
        }
        var jwtoken = req.headers.jwtoken;

        jwt.verify(jwtoken, 'posable', verifyCallback);

    } catch(err) {
        logPlugin.error(err);
        statusObject.isOK = false;
        statusObject['error'] = {
            error: {code: 400, message: "System Error in Authenticate Post"}
        };
        internalErr = err;
        console.log(internalErr)
        return callback(internalErr, statusObject);
    }
    function verifyCallback(err, decoded) {

        if (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "System error decrypting json web token"}
            };
            return exitAuthPost(err, statusObject);
        }
        configPlugin.merchantLookup(decoded.internalID, logPlugin, merchantLookupCallback);
    }

    function merchantLookupCallback(err, merchant) {
        var merchantError;
        if (err) {
            merchantError = err
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 500, message: 'System error searching merchant records'}
            };
        } else if (merchant === null || merchant === undefined) {
            merchantError = new Error('No merchant record found');
            logPlugin.error(merchantError);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: 'No merchant record found'}
            };
        } else {
            statusObject.merchant = merchant;
            statusObject.success.push("authenticatePost");
        }
        return exitAuthPost(merchantError, statusObject);
    }

    function exitAuthPost(internalErr, statusObject) {
        if (statusObject.isOK) logPlugin.debug('Finished authenticatePost Module');
        if (!statusObject.isOK) logPlugin.debug('Finished authenticatePost Module with errors');
        return callback(internalErr, statusObject);
    }
 };

var testingStub = function (testLogPlugin, testConfigPlugin) {
    logPlugin = testLogPlugin;
    configPlugin = testConfigPlugin;
};

module.exports = {
    authenticatePost: authenticatePost,
    testingStub: testingStub
};
