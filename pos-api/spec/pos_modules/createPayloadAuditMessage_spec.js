/**
 * Created by davidabramowitz on 3/25/16.
 */

describe("Test 'createPayloadAuditMessage' module & 'createPayloadAuditMessage' function", function() {
    var createPayloadAuditMessage = require('../../lib/pos_modules/createPayloadAuditMessage').createPayloadAuditMessage;
    var statusObject = {};
    var req = {body: {test: "testing my body!", transaction: {isvoid: false, isrefund: false}}};
    var requestID = 1;

    describe("Happy path", function() {
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){goodCallback()}};
        var testWascallyRabbit = {raiseNewPayloadAuditEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, internalID: 1};
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewPayloadAuditEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/createPayloadAuditMessage').testingStub;
            testStub(testLogPlugin, testWascallyRabbit);
        });

        it("Should send message to rabbitmq and call logPlugin.debug", function () {
            createPayloadAuditMessage(req, statusObject, requestID);
            expect(testWascallyRabbit.raiseNewPayloadAuditEvent).toHaveBeenCalled();
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });
    });
    describe("Error path", function() {
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){errorCallback()}};
        var testWascallyRabbit = {raiseNewPayloadAuditEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, internalID: 1};
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewPayloadAuditEvent").and.returnValue(testWascallyRabbitreturn);
            var testStub = require('../../lib/pos_modules/createPayloadAuditMessage').testingStub;
            testStub(testLogPlugin, testWascallyRabbit);
        });

        it("Should attempt sending a message to rabbitmq and call logPlugin.error", function () {
            createPayloadAuditMessage(req, statusObject, requestID);
            expect(testWascallyRabbit.raiseNewPayloadAuditEvent).toHaveBeenCalled();
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("System error path", function() {
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbitreturn = {then: function(goodCallback, errorCallback){errorCallback()}};
        var testWascallyRabbit = {raiseNewPayloadAuditEvent: function () {return testWascallyRabbitreturn }};

        beforeEach(function () {
            statusObject = {isOK: true, internalID: 1};
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testWascallyRabbitreturn, "then").and.callThrough();
            spyOn(testWascallyRabbit,"raiseNewPayloadAuditEvent").and.throwError("Test Error");
            var testStub = require('../../lib/pos_modules/createPayloadAuditMessage').testingStub;
            testStub(testLogPlugin, testWascallyRabbit);
        });

        it("Should catch error calling rabbitmq", function () {
            createPayloadAuditMessage(req, statusObject, requestID);
            expect(testLogPlugin.debug).toHaveBeenCalled();
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });
});
