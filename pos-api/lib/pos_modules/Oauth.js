var o2x = require('object-to-xml');

var sendError  = function (res, message, status) {
    res.status(status);
    if (res.req.headers['content-type'] === 'application/xml') {
        res.send(o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            error: message,
        }));
    } else {
        res.json({
            error: message,
        });
    }
};

var Oauth = function (req, res, uid) {
    this.req = req;
    this.res = res;
    this.uid = uid;
    this.token = 'm8l0isN6m1ZK3NPX';
}

    Oauth.prototype.authenticatePost = function () {
        var message = "";
        if (this.req.headers.token === null || this.req.headers.token === undefined) {
            message = "Unauthorized, token is missing";
            sendError(this.res, message, 401);
            return false;
        } else if (this.req.headers.token === this.token) {
            return true;
        } else {
            message = "Unauthorized, incorrect token";
            sendError(this.res, message, 401);
            return false;
        }
    }

    Oauth.prototype.getToken = function () {
        return this.token;
    }

    Oauth.prototype.createToken = function () {
        // Generate a 16 character alpha-numeric token:
        return this.uid(16)
    }

module.exports = Oauth;