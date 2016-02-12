describe("Test 'authenticatePost' module & 'checkPostToken' function", function() {
    var checkPostToken = require('../../lib/pos_modules/api/authenticatePost').authenticatePost;
    var testStub = require('../../lib/pos_modules/api/authenticatePost').testingStub;
    var statusObject = {};
    var callback;

    describe("Token in header is null or undefined", function() {
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testConfigPlugin = function () {};

        beforeEach(function () {
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            statusObject = {isOK: true, success: {push: function (){}}};
            spyOn(statusObject.success, 'push').and.throwError("Catch this System Error - Pass to Callback");
        });

        it("Should log and error and return the callback with an error for header.token equal to null", function (done) {
            callback = function (internalErr, statusObject) {
                expect(internalErr.message).toEqual('Missing json web token' );
                expect(statusObject.isOK).toBe(false);
                expect(testLogPlugin.error).toHaveBeenCalledWith(new Error('Missing json web token'));
                done();
            };
            var req = {headers: {jwtoken: null}};
            testStub(testLogPlugin, testConfigPlugin);
            checkPostToken(req, statusObject, callback);
        });

        it("Should log and error and return the callback with an error for header.token equal to undefined", function (done) {
            callback = function (internalErr, statusObject) {
                expect(internalErr.message).toEqual('Missing json web token');
                expect(statusObject.isOK).toBe(false);
                expect(testLogPlugin.error).toHaveBeenCalled();
                done();
            };
            var req = {headers: {jwtoken: undefined}};
            testStub(testLogPlugin, testConfigPlugin);
            checkPostToken(req, statusObject, callback);
        });
    });

    describe("using the correct token", function() {
        var jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRGF0YUNhcCIsImludGVybmFsSUQiOjEsImlhdCI6MTQ1MDE5NjY3OH0.I1r9k_-20pTiAYrEo3LZ1BUPqbtG8fP4hRZe1gC_RE8";
        var req = {headers: {jwtoken: jwt}}; //hard coded token
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testConfigPlugin = {merchantLookup: function(Id, Log, merchantLookupCallback){merchantLookupCallback(undefined, {})}};

        beforeEach(function () {
            statusObject = {isOK: true, success: []};
        });

        it("Should not have an internal system error", function (done) {
            callback = function (internalErr) {
                expect(internalErr).toEqual(undefined);
                done();
            };
            testStub(testLogPlugin, testConfigPlugin);
            checkPostToken(req, statusObject, callback);
        });

        it("Should push one string into success array", function (done) {
            callback = function (internalErr, statusObject) {
                expect(statusObject.success.length).toEqual(1);
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should push 'authenticatePost' into the success array in statusObject", function (done) {
            callback = function (internalErr, statusObject) {
                expect(statusObject.success[0]).toEqual("authenticatePost");
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should NOT push an error object into statusObject", function (done) {
            callback = function (internalErr, statusObject) {
                expect(statusObject.error).toEqual(undefined);
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should be an Asynchronous function, callback executes after 'push' method ", function (done) {
            callback = function (internalErr, statusObject) {
                expect(statusObject.success[0]).toEqual("firstInArray-AsynchTest");
                done();
            };
            checkPostToken(req, statusObject, callback);
            statusObject.success.push("firstInArray-AsynchTest");
        });
    });

    describe("NOT using a properly formatted token", function() {
        var jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJYUzI1NiJ9.eyJuYW1lIjoiRGF0YUNhcCIsImludGVybmFsSUQiOjEsImhhdCI6MTQ1MDE5NjY3OH0.I1r9k_-20pTiAYrE3LZ1BUPqbtG8fP4hRZe1gC_RE8";
        var req = {headers: {token: 'badToken',jwtoken: jwt }}; //hard coded token

        beforeEach(function() {
            statusObject = {isOK: true, success: []};
        });

        it("Should return jwt parsing error", function (done) {
            callback = function(internalErr) {
                expect(internalErr.message).toEqual('invalid algorithm');
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should NOT push string into success array", function (done) {
            callback = function(internalErr, statusObject) {
                expect(statusObject.success.length).toEqual(0);
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should NOT push 'authenticatePost' into the success array in statusObject", function (done) {
            callback = function(internalErr, statusObject) {
                expect(statusObject.success[0]).toEqual(undefined);
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should push an error object into statusObject", function (done) {
            callback = function(internalErr, statusObject) {
                expect(typeof statusObject.error).toEqual("object");
                done();
            };
            checkPostToken(req, statusObject, callback);
        });

        it("Should change state of statusObject isOK to false", function (done) {
            callback = function(internalErr, statusObject) {
                expect(statusObject.isOK).toEqual(false);
                done();
            };
            checkPostToken(req, statusObject, callback);
        });
    });

    describe("System Error in try-catch", function() {
        var jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRGF0YUNhcCIsImludGVybmFsSUQiOjEsImlhdCI6MTQ1MDE5NjY3OH0.I1r9k_-20pTiAYrEo3LZ1BUPqbtG8fP4hRZe1gC_RE8";
        var req = {headers: {jwtoken: jwt}}; //hard coded token - in future, get from DB
        var testLogPlugin = {error: function () {}, debug: function (){}};
        var testConfigPlugin = {merchantLookup: function(Id, Log, merchantLookupCallback){merchantLookupCallback(undefined, {})}};

        beforeEach(function () {
            statusObject = {isOK: true, success: {push: function (){}}};
            spyOn(testLogPlugin, 'debug').and.throwError("Catch this System Error");
        });

        it("Should catch an internal system error", function () {
            callback = function (internalErr) {
                expect(internalErr.message).toEqual("Catch this System Error");
            };
            testStub(testLogPlugin, testConfigPlugin);
            checkPostToken(req, statusObject, callback);
        });
    });
});
