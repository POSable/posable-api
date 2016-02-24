function reqHeaderTokenProvider (req, statusObject, logPlugin) {
    try {
        var token;
        logPlugin.debug('Starting request header token provider');
        if (req.headers.jwtoken === null || req.headers.jwtoken === undefined) {
            var err = new Error('Missing json web token');
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "Missing json web token"}
            };
            token = undefined;
            logPlugin.debug('Finished request header token provider with errors');

        } else {
            token = req.headers.jwtoken;
            logPlugin.debug('Finished request header token provider');
        }

        return token;

    } catch (err) {
        if (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "System Error in 'reqHeaderTokenProvider' module"}
            };
        }
        throw err
    }
}

module.exports = reqHeaderTokenProvider;