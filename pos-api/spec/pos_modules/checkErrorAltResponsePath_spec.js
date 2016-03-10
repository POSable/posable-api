/**
 * Created by davidabramowitz on 3/10/16.
 */

describe("Test 'checkErrorAltResponsePath' module & 'checkErrorAltResponsePath' function", function() {
    var checkErrorAltResponsePath = require('../../lib/pos_modules/checkErrorAltResponsePath').checkErrorAltResponsePath;
    var testStub = require('../../lib/pos_modules/checkErrorAltResponsePath').testingStub;
    var statusObject = {};
    var req = {body: {test: "testing my body!"}};

    describe(" Happy path", function() {
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbit = {
            raiseErrorResponseEmailAndPersist: function () { return {catch: function(){}}}
        };
        beforeEach(function () {
            statusObject = {isOK: true, merchant: {responseType:'alt'}};
            spyOn(testWascallyRabbit, "raiseErrorResponseEmailAndPersist");
        });

        it("Should do nothing, no alt path needed - statusObject.isOk is true", function () {
            testStub(testLogPlugin, testWascallyRabbit);
            checkErrorAltResponsePath(req, statusObject);
            expect(testWascallyRabbit.raiseErrorResponseEmailAndPersist).not.toHaveBeenCalled();
        });
    });

    describe(" Alt path", function() {
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbit = {
            raiseErrorResponseEmailAndPersist: function() {}
        };
        beforeEach(function () {
            statusObject = {isOK: false, merchant: {responseType:'alt'}};
            spyOn(testWascallyRabbit, "raiseErrorResponseEmailAndPersist").and.returnValues({catch: function(){}});
        });

        it("Should send message to Rabbit for alt path - statusObject.isOk is false", function () {
            testStub(testLogPlugin, testWascallyRabbit);
            checkErrorAltResponsePath(req, statusObject);
            expect(testWascallyRabbit.raiseErrorResponseEmailAndPersist).toHaveBeenCalled();
        });
    });

    describe(" Error when sending to rabbitmq", function() {
        var testLogPlugin = {
            error: function (text) {
                console.log(text)
            }, debug: function (text) {
                console.log(text)
            }
        };
        var testWascallyRabbit = {
            raiseErrorResponseEmailAndPersist: function() {}
        };
        beforeEach(function () {
            statusObject = {isOK: false, merchant: {responseType:'alt'}};
            spyOn(testWascallyRabbit, "raiseErrorResponseEmailAndPersist").and.returnValues({catch: function(errCallback){errCallback()}});
            spyOn(testLogPlugin, "error");
        });

        it("Should log an error when wascaly is called", function () {
            testStub(testLogPlugin, testWascallyRabbit);
            checkErrorAltResponsePath(req, statusObject);
            expect(testWascallyRabbit.raiseErrorResponseEmailAndPersist).toHaveBeenCalled();
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });
});
