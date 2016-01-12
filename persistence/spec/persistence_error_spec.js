describe("test error persistence-service", function() {

    var persistError = require('../handlers/createErrorPersist').createErrorPersist;
    var testErrorMsg = {body: {}};
    var testMapping = {testMapError: function () {}};
    var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
    var testDispose = {testRabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
    var testMapErrorMethod = {save: function (callback) {callback()}};

    describe("code executes as expected", function() {

        beforeEach(function () {
            spyOn(testMapErrorMethod, 'save').and.callThrough();
            spyOn(testMapping, 'testMapError').and.returnValue(testMapErrorMethod);
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createErrorPersist').testingStub;
            setTestStubs(testMapping, testLogPlugin, testDispose);
        });

        it("maps the msg into a model and logs the success", function () {
            persistError(testErrorMsg);
            expect(testMapping.testMapError).toHaveBeenCalledWith(testErrorMsg.body);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("in the callback, it logs a successful save and disposes the message without an error", function () {
            persistError(testErrorMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Error saved successfully' );
            expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testErrorMsg, undefined);
            expect(testMapErrorMethod.save).toHaveBeenCalled();
        });

    });

    describe("fails mapping to model", function() {

        beforeEach(function () {
            spyOn(testMapping, 'testMapError').and.returnValue(undefined);
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createErrorPersist').testingStub;
            setTestStubs(testMapping, testLogPlugin, testDispose);
        });

        it("when mapError returns undefined it disposes the message with an error and logs an error", function () {
            persistError(testErrorMsg);
            expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testErrorMsg, new Error( "Failed Error Persistence Model Mapping"));
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("creates a system error to be caught and thrown", function() {

        beforeEach(function () {
            spyOn(testMapping, 'testMapError').and.returnValue({save: function (callback) {callback()}});
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose').and.throwError('This is a testing Error - Please Catch Me!');

            var setTestStubs = require('../handlers/createErrorPersist').testingStub;
            setTestStubs(testMapping, testLogPlugin, testDispose);
        });

        it("when LogPlugin.debug fails", function () {
            try {
                persistError(testErrorMsg);
            } catch (err) {
                expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testErrorMsg, new Error( 'This is a testing Error - Please Catch Me!'));
                expect(testLogPlugin.error).toHaveBeenCalled();
            }
        });
    });
});
