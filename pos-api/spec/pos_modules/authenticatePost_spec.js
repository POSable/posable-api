describe("Test 'authenticatePost' module & 'checkPostToken' function", function() {
    var checkPostToken = require('../../lib/pos_modules/api/authenticatePost');
    var statusObject = {};
    var callback;

    describe("using the correct token", function() {
        var req = {headers: {token: 'm8l0isN6m1ZK3NPX'}}; //hard coded token - in future, get from DB

        beforeEach(function () {
            statusObject = {isOK: true, success: []};
        });

        it("Should not have an internal system error", function (done) {
            callback = function (internalErr) {
                expect(internalErr).toEqual(null);
                done();
            };
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

    describe("NOT using a correct token", function() {
        var req = {headers: {token: 'badToken'}}; //hard coded token - in future, get from DB

        beforeEach(function() {
            statusObject = {isOK: true, success: []};
        });

        it("Should not have an internal system error", function (done) {
            callback = function(internalErr) {
                expect(internalErr).toEqual(null);
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
        var req = {headers: {token: 'm8l0isN6m1ZK3NPX'}}; //hard coded token - in future, get from DB

        beforeEach(function () {
            statusObject = {isOK: true, success: {push: function (){}}};
            spyOn(statusObject.success, 'push').and.throwError("Catch this System Error - Pass to Callback");
        });

        it("Should throw and catch an internal system error", function (done) {
            callback = function (internalErr) {
                expect(internalErr.message).toEqual("Catch this System Error - Pass to Callback");
                done();
            };
            checkPostToken(req, statusObject, callback);
        });
    });
});
