describe("Test 'authenticatePost' module & 'checkPostToken' function", function() {

    var testObject = {};
    var req = {headers: {token: 'm8l0isN6m1ZK3NPX'}}; //hard coded token - in future, get from DB
    var statusObject = {isOK: true, success: []};

    beforeEach(function(done) {
        statusObject.success = [];
        var checkPostToken = require('../lib/pos_modules/api/authenticatePost');
        var callback = function(internalErr, statusObject) {
            testObject =  {
                internalErr : internalErr,
                statusObject: statusObject
            };
            done();
        };
        checkPostToken(req, statusObject, callback);
        statusObject.success.push("firstInArray-AsynchTest");
    });

    it("Should not have an internal system error", function () {
        expect(testObject.internalErr).toEqual(null);
    });

    it("Should push two strings into success array", function () {
        expect(testObject.statusObject.success.length).toEqual(2);
    });

    it("Should be an Asynchronous function, callback executes last ", function () {
        expect(testObject.statusObject.success[0]).toEqual("firstInArray-AsynchTest");
    });

    it("Should push 'authenticatePost' into the success array in statusObject", function () {
        expect(testObject.statusObject.success[1]).toEqual("authenticatePost");
    });

    it("Should not push an error into statusObject", function () {
        expect(statusObject.error).toEqual(undefined);
    });
});