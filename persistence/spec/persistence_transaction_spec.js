describe("test persistence-service", function() {

    var persistTransaction = require('../handlers/createTransactionPersistence').createTransactionPersistence;
    var testTransactionMsg = {};
    var testMapping = {testMapTransaction: function () {}};
    var testValidate = {validateTransaction: function () {}};
    var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
    var testDispose = {testRabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
    var testMapTransMethod = {save: function (callback) {callback()}};

    describe("code executes as expected", function() {

        beforeEach(function () {
            spyOn(testMapTransMethod, 'save').and.callThrough();
            spyOn(testMapping, 'testMapTransaction').and.returnValue(testMapTransMethod);
            spyOn(testValidate, 'validateTransaction').and.returnValue({isValid: true});
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createTransactionPersistence').testingStub;
            setTestStubs(testMapping, testValidate, testLogPlugin, testDispose);
        });

        it("maps the msg into a model and logs the success", function () {
            persistTransaction(testTransactionMsg);
            expect(testMapping.testMapTransaction).toHaveBeenCalledWith(testTransactionMsg);
            expect(testLogPlugin.debug).toHaveBeenCalled();
        });

        it("vaildates the transaction", function () {
            persistTransaction(testTransactionMsg);
            expect(testValidate.validateTransaction).toHaveBeenCalled();
        });

        it("in the callback, it logs a successful save and disposes the message without an error", function () {
            persistTransaction(testTransactionMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Transaction was saved');
            expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testTransactionMsg, undefined);
            expect(testMapTransMethod.save).toHaveBeenCalled();
        });

    });

    describe("fails mapping to model", function() {

        beforeEach(function () {
            spyOn(testMapping, 'testMapTransaction').and.returnValue(undefined);
            spyOn(testValidate, 'validateTransaction');
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createTransactionPersistence').testingStub;
            setTestStubs(testMapping, testValidate, testLogPlugin, testDispose);
        });

        it("when mapTransaction returns undefined it disposes the message with an error and logs an error", function () {
            persistTransaction(testTransactionMsg);
            expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testTransactionMsg, new Error( "Failed Transaction Persistence Model Mapping"));
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

    describe("fails validation", function() {

        beforeEach(function () {
            spyOn(testMapping, 'testMapTransaction').and.returnValue(testMapTransMethod);
            spyOn(testValidate, 'validateTransaction').and.returnValue({isValid: false});
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createTransactionPersistence').testingStub;
            setTestStubs(testMapping, testValidate, testLogPlugin, testDispose);
        });

        it("when validation returns False for isValid property", function () {
            persistTransaction(testTransactionMsg);
            expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testTransactionMsg, new Error( "Failed Transaction Persistence Validation"));
            expect(testLogPlugin.error).toHaveBeenCalled();
        });

    });

    describe("creates a system error to be caught and thrown", function() {

        beforeEach(function () {
            spyOn(testMapping, 'testMapTransaction').and.returnValue({save: function (callback) {callback()}});
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug').and.throwError('This is a testing Error - Please Catch Me!');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createTransactionPersistence').testingStub;
            setTestStubs(testMapping, testValidate, testLogPlugin, testDispose);
        });

        it("when LogPlugin.debug fails", function () {
            try {
                persistTransaction(testTransactionMsg);e
            } catch (err) {
                expect(testDispose.testRabbitDispose).toHaveBeenCalledWith(testTransactionMsg, new Error( 'This is a testing Error - Please Catch Me!'));
                expect(testLogPlugin.error).toHaveBeenCalled();
            }
        });
    });
});
