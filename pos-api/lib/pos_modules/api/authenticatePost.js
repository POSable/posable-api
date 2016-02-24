var jwt = require('jsonwebtoken');
var logPlugin = require('posable-logging-plugin');

var authenticatePost = function (jwtokenRequest, statusObject, callback) {
    try {
        logPlugin.debug('Starting authenticatePost Module');
            // eventualy 'posable' key is changed to a configurable variable.
        jwt.verify(jwtokenRequest, 'posable', verifyCallback)

    } catch(err) {
        logPlugin.error(err);
        statusObject.isOK = false;
        statusObject['error'] = {
            error: {code: 400, message: "System Error in Authenticate Post"}
        };
        // keep function asynchronous
        process.nextTick(function () {return exitAuthPost(err, statusObject)});
    }

    // callbacks below
    function verifyCallback(err, decoded) {
        // decoded is the body of the jwt token...decoded.

        if (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "System error decrypting json web token"}
            };

        } else {
            statusObject.internalID = decoded.internalID
            statusObject.success.push("authenticatePost");
        }
        return exitAuthPost(err, statusObject);
    }

    function exitAuthPost(err, statusObject) {
        if (statusObject.isOK) logPlugin.debug('Finished authenticatePost Module');
        if (!statusObject.isOK) logPlugin.debug('Finished authenticatePost Module with errors');
        return callback(err, statusObject);
    }
 };

var testingStub = function (testLogPlugin) {
    logPlugin = testLogPlugin;
};

module.exports = {
    authenticatePost: authenticatePost,
    testingStub: testingStub
};