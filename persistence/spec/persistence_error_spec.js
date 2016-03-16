var persistError = require('../handlers/createErrorPersistence').createErrorPersistence;
var setTestStubs = require('../handlers/createErrorPersistence').testingStub;
var testLogPlugin = {error: function (){}, debug: function (){}};
var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
var testMsg;
var testMapError;

describe("Error persistence", function() {

    describe("saves and disposes of valid error messages by", function () {

        beforeEach(function(){
            testMsg = {save: function(callback){return callback(null)}};
            testMapError = {mapError: function (testMsg) {return testMsg}};

            spyOn(testMapError, 'mapError').and.callThrough();
            spyOn(testMsg, 'save').and.callThrough();
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');

            setTestStubs(testMapError, testLogPlugin, testDispose);
            persistError(testMsg);
        });

        it("mapping the msg to the error model", function () {
            expect(testMapError.mapError).toHaveBeenCalledWith(testMsg);
        });

        it("saving the error", function () {
            expect(testMsg.save).toHaveBeenCalled();
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Error saved');
        });

        it("disposing of the message", function () {
            expect(testDispose.rabbitDispose).toHaveBeenCalled();
        });
    });
});