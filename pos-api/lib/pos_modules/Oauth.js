


var Oauth = function (req, res, uid) {
    this.req = req;
    this.res = res;
    this.uid = uid;
    this.token = 'm8l0isN6m1ZK3NPX';
}

    Oauth.prototype.authenticatePost = function () {
        if (this.req.headers.token === null || this.req.headers.token === undefined) {
            var errAuth1 = new Error();
            errAuth1.message = "Unauthorized, token is missing";
            this.res.status(401);
            this.res.json({error: errAuth1.message, code: 401});
            return false;
        } else if (this.req.headers.token === this.token) {
            this.res.status(200);
            return true;
        } else {
            var errAuth2 = new Error();
            errAuth2.message = "Unauthorized, incorrect token";
            this.res.status(401);
            this.res.json({error: errAuth2.message, code: 401});
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