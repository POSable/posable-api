/**
 * Created by davidabramowitz on 3/10/16.
 */

describe("Test 'processRefund' module & 'processRefund' function", function() {
    var processRefund = require('../../lib/pos_modules/processRefund').processRefund;
    var statusObject = {};
    var req = {body: {test: "testing my body!"}};
    var res = {};
    var requestID = 1;
    var merchant = {responseType:'alt', internalID: 1};

    describe("Happy path", function() {
        var testValidate = {validateTransaction: function () {}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (undefined, merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}};
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewRefundEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewRefundEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should lookup the merchant", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testConfigPlugin.merchantLookup).toHaveBeenCalled();
        });

        it("Should set status Object merchant and push merchantLookup into success", function () {
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.merchant).toEqual({ responseType: 'alt', internalID: 1 });
            expect(statusObject.success.indexOf("merchantLookup")).not.toBe(-1);
        });

        it("Should create transaction DTO", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testObject.testCreateTransactionDTO).toHaveBeenCalled();
        });
        it("Should map the transaction", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testObject.testMapTransaction).toHaveBeenCalled();
        });

        it("Should validate the mapped DTO", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testValidate.validateTransaction).toHaveBeenCalled();
            expect(statusObject.success.indexOf("validated")).not.toBe(-1);
        });
        it("Should raise a new refund event to rabbitmq", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testWascallyRabbit.raiseNewRefundEvent).toHaveBeenCalled();
        });
        it("Should send an http response", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testObject.testSendResponse).toHaveBeenCalled();
        });
    });

    describe("statusObject starts with an error - statusObject.isOK is false", function() {
        var testValidate = {validateTransaction: function () {}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (undefined, merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewRefundEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: false, merchant: merchant, success: []};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewRefundEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should check error alternate path then sendResponse", function () {
            processRefund(req, res, statusObject, requestID);
            expect(testObject.testCheckErrorAltResponsePath).toHaveBeenCalled();
            expect(testObject.testSendResponse).toHaveBeenCalled();
        });
    });

    describe("merchantLookup returns an err object", function() {
        var error = new Error("test error");
        var testValidate = {validateTransaction: function () {}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (error, merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {testSendResponse: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "error");
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"testSendResponse").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("merchantLookup returns a bad merchant object - but no error object", function() {
        var testValidate = {validateTransaction: function () {}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewRefundEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "debug");
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewRefundEvent").and.returnValue(testWascallyRabbitreturn);
        });

        it("Merchant is null", function () {
            merchant = null;
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("Merchant is undefined", function () {
            merchant = undefined;
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("Merchant id is undefined", function () {

            merchant = {internalID: undefined};
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });
    });

    describe("validate returns an object with isValid property false", function() {
        var testValidate = {validateTransaction: function () {return {isValid: false}}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewRefundEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "error");
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewRefundEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("raise new refund promise runs error function", function() {
        var testValidate = {validateTransaction: function () {return {isValid: true}}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}, testCheckErrorAltResponsePath: function() {}};
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){errorCallback()}};
        var testWascallyRabbit = {raiseNewRefundEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "error");
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewRefundEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processRefund').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processRefund(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });
});
