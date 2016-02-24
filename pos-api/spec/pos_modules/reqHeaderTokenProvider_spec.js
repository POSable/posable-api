describe("Test 'reqHeaderTokenProvider' module & 'reqHeaderTokenProvider' function", function() {
    var reqHeaderTokenProvider = require ('../../lib/pos_modules/api/reqHeaderTokenProvider');
    var statusObject = {};
    var req = {headers: {jwtoken: undefined}};
    var token;

    describe("Token in header exists", function() {
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};

        beforeEach(function () {
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            statusObject = {isOK: true, success: {push: function (){}}};
            spyOn(statusObject.success, 'push').and.throwError("Catch this System Error - Pass to Callback");
        });

        it("Should return the token to the calling code", function () {
            req.headers.jwtoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRGF0YUNhcCIsImludGVybmFsSUQiOjEsImlhdCI6MTQ1MDE5NjY3OH0.I1r9k_-20pTiAYrEo3LZ1BUPqbtG8fP4hRZe1gC_RE8";
            token = reqHeaderTokenProvider(req, statusObject, testLogPlugin);
            expect(statusObject.isOK).toBe(true);
            expect(testLogPlugin.debug).toHaveBeenCalled();
            expect(token).toEqual("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRGF0YUNhcCIsImludGVybmFsSUQiOjEsImlhdCI6MTQ1MDE5NjY3OH0.I1r9k_-20pTiAYrEo3LZ1BUPqbtG8fP4hRZe1gC_RE8")
        });
    });

    describe("Token in header is null or undefined", function() {
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};

        beforeEach(function () {
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            statusObject = {isOK: true, success: {push: function (){}}};
            spyOn(statusObject.success, 'push').and.throwError("Catch this System Error - Pass to Callback");
        });

        it("Should log an error when token equal to null", function () {
                req.headers.jwtoken = null;
                reqHeaderTokenProvider(req, statusObject, testLogPlugin);
                expect(statusObject.error.error.message).toEqual('Missing json web token' );
                expect(statusObject.isOK).toBe(false);
                expect(testLogPlugin.error).toHaveBeenCalledWith(new Error('Missing json web token'));

        });

        it("Should log an error when token equal to undefined", function () {
            req.headers.jwtoken = undefined;
            reqHeaderTokenProvider(req, statusObject, testLogPlugin);
                expect(statusObject.error.error.message).toEqual('Missing json web token');
                expect(statusObject.isOK).toBe(false);
                expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });
});