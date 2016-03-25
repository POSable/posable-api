/**
 * Created by davidabramowitz on 3/10/16.
 */

describe("Test 'processTransaction' module & 'processTransaction' function", function() {
    var processTransaction = require('../../lib/pos_modules/processTransaction').processTransaction;
    var statusObject = {};
    var req = {body: {test: "testing my body!", transaction: {isvoid: false, isrefund: false}}};
    var res = {};
    var requestID = 1;
    var merchant = {responseType:'alt', internalID: 1};

    describe("Happy path", function() {
        var testValidate = {validateTransaction: function () {}};
        var testConfigPlugin = {merchantLookup: function (id, callback) {callback (undefined, merchant)}};
        var testObject = {testCreateTransactionDTO: function() {}, testMapTransaction: function() {}, testSendResponse: function () {}};
        var testCheckErrorAltResponsePath;
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewTransactionEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewTransactionEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testCheckErrorAltResponsePath);
        });

        it("Should lookup the merchant", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(testConfigPlugin.merchantLookup).toHaveBeenCalled();
        });

        it("Should set status Object merchant and push merchantLookup into success", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(statusObject.merchant).toEqual({ responseType: 'alt', internalID: 1 });
            expect(statusObject.success.indexOf("merchantLookup")).not.toBe(-1);
        });

        it("Should create transaction DTO", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(testObject.testCreateTransactionDTO).toHaveBeenCalled();
        });
        it("Should map the transaction", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(testObject.testMapTransaction).toHaveBeenCalled();
        });

        it("Should validate the mapped DTO", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(testValidate.validateTransaction).toHaveBeenCalled();
            expect(statusObject.success.indexOf("validated")).not.toBe(-1);
        });
        it("Should raise a new transaction event to rabbitmq", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(testWascallyRabbit.raiseNewTransactionEvent).toHaveBeenCalled();
        });
        it("Should send an http response", function () {
            processTransaction(req, res, statusObject, requestID);
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
        var testWascallyRabbit = {raiseNewTransactionEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: false, merchant: merchant, success: []};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewTransactionEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should check error alternate path then sendResponse", function () {
            processTransaction(req, res, statusObject, requestID);
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
        var testWascallyRabbit = {raiseNewTransactionEvent: function () {return testWascallyRabbitreturn }};

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
            spyOn(testWascallyRabbit,"raiseNewTransactionEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processTransaction(req, res, statusObject, requestID);
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
        var testWascallyRabbit = {raiseNewTransactionEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, merchant: merchant, success: []};
            spyOn(testLogPlugin, "debug");
            spyOn(testObject,"testCreateTransactionDTO").and.returnValue({});
            spyOn(testObject,"testMapTransaction").and.returnValue({});
            spyOn(testValidate,"validateTransaction").and.returnValue({});
            spyOn(testObject,"testSendResponse").and.returnValue(function(){});
            spyOn(testObject,"testCheckErrorAltResponsePath").and.returnValue({});
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewTransactionEvent").and.returnValue(testWascallyRabbitreturn);
        });

        it("Merchant is null", function () {
            merchant = null;
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processTransaction(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("Merchant is undefined", function () {
            merchant = undefined;
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processTransaction(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("Merchant id is undefined", function () {

            merchant = {internalID: undefined};
            testConfigPlugin = {merchantLookup: function (id, callback) {callback (merchant)}};
            spyOn(testConfigPlugin, "merchantLookup").and.callThrough();
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
            processTransaction(req, res, statusObject, requestID);
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
        var testWascallyRabbit = {raiseNewTransactionEvent: function () {return testWascallyRabbitreturn }};

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
            spyOn(testWascallyRabbit,"raiseNewTransactionEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("raise new transaction promise runs error function", function() {
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
        var testWascallyRabbit = {raiseNewTransactionEvent: function () {return testWascallyRabbitreturn }};

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
            spyOn(testWascallyRabbit,"raiseNewTransactionEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/processTransaction').testingStub;
            testStub(testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testObject.testCreateTransactionDTO, testObject.testMapTransaction, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath);
        });

        it("Should set statusObject.isOk to false and log the error", function () {
            processTransaction(req, res, statusObject, requestID);
            expect(statusObject.isOK).toBe(false);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });
});
