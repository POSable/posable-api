/**
 * Created by davidabramowitz on 3/10/16.
 */

describe("Test 'processVoid' module & 'processVoid' function", function() {
    var processVoid = require('../../lib/pos_modules/processVoid').processVoid;
    var statusObject = {};
    var req = {body: {test: "testing my body!"}};
    var res = {};
    var requestID = 1;
    var merchant = {responseType:'alt', internalID: 1};

    describe("Happy path", function() {
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (undefined, merchant)}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testObject = {testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewVoidEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewVoidEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should lookup the merchant", function () {
            processVoid(req, res, statusObject, requestID);
            expect(testConfigPlugin.merchantLookup).toHaveBeenCalled();
        });

        it("Should set status Object merchant and push merchantLookup into success", function () {
            processVoid(req, res, statusObject, requestID);
            expect(statusObject.merchant).toEqual({ responseType: 'alt', internalID: 1 });
            expect(statusObject.success.indexOf("merchantLookup")).not.toBe(-1);
        });

        it("Should raise a new void event to rabbitmq", function () {
            processVoid(req, res, statusObject, requestID);
            expect(testWascallyRabbit.raiseNewVoidEvent).toHaveBeenCalled();
        });
        it("Should send an http response", function () {
            processVoid(req, res, statusObject, requestID);
            expect(testObject.testSendResponse).toHaveBeenCalled();
        });
    });

    describe("statusObject starts with an error - statusObject.isOK is false", function() {
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (undefined, merchant)}};
        var testObject = {testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewVoidEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: false, merchant: merchant, success: []};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewVoidEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should check error alternate path then sendResponse", function () {
            processVoid(req, res, statusObject, requestID);
            expect(testObject.testCheckErrorAltResponsePath).toHaveBeenCalled();
            expect(testObject.testSendResponse).toHaveBeenCalled();
        });
    });

    describe("merchantLookup returns an err object", function() {
        var error = new Error("test error");
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (error, merchant)}};
        var testObject = {testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewVoidEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "error");
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewVoidEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processVoid(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("merchantLookup returns a bad merchant object - but no error object", function() {
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
        var testObject = {testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewVoidEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "debug");
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewVoidEvent").and.returnValue(testWascallyRabbitreturn);
        });

        it("Merchant is null", function () {
            merchant = null;
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processVoid(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("Merchant is undefined", function () {
            merchant = undefined;
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processVoid(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("Merchant id is undefined", function () {

            merchant = {internalID: undefined};
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processVoid(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });
    });


    describe("raise new void promise runs error function", function() {
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){errorCallback()}};
        var testWascallyRabbit = {raiseNewVoidEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "error");
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewVoidEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processVoid').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testConfigPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processVoid(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });
});
