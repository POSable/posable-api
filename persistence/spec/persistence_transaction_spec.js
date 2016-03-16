var persistTransaction = require('../handlers/createTransactionPersistence').createTransactionPersistence;
var setTestStubs = require('../handlers/createTransactionPersistence').testingStub;
var testLogPlugin = {error: function (){}, debug: function (){}};
var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
var testMsg;
var testMapTransaction;
var testValidate;

describe("Transaction persistence", function() {

    describe("saves and disposes of valid transaction messages by", function() {

        beforeEach(function () {
            testMsg = {save: function(callback){return callback(null)}};
            testMapTransaction = {mapTransaction: function (testMsg) {return testMsg}};
            testValidate = {validateTransaction: function () {return {isValid: true}}};

            spyOn(testMapTransaction, 'mapTransaction').and.callThrough();
            spyOn(testValidate, 'validateTransaction').and.callThrough();
            spyOn(testMsg, 'save').and.callThrough();
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');

            setTestStubs(testMapTransaction, testValidate, testLogPlugin, testDispose);
            persistTransaction(testMsg);
        });

        it("mapping the msg to the transaction model", function () {
            expect(testMapTransaction.mapTransaction).toHaveBeenCalledWith(testMsg);
        });

        it("validating the transaction before saving", function () {
            expect(testValidate.validateTransaction).toHaveBeenCalledWith(testMsg);
        });

        it("saving the transaction", function () {
            expect(testMsg.save).toHaveBeenCalled();
        });

        it("disposing of the message", function () {
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Transaction saved');
            expect(testDispose.rabbitDispose).toHaveBeenCalled();
        });
    });

    describe("dead letters the transaction message", function () {

        beforeEach(function () {
            testMapTransaction = {mapTransaction: function () { throw new Error('test mapping error')}};
            spyOn(testLogPlugin, 'error');
            spyOn(testDispose, 'rabbitDispose');

            setTestStubs(testMapTransaction, null, testLogPlugin, testDispose);
            persistTransaction(testMsg);
        });

        it("when transaction mapping fails", function () {
            expect(testLogPlugin.error).toHaveBeenCalled();
            expect(testDispose.rabbitDispose).toHaveBeenCalled();
        });
    });

    describe("dead letters the transaction message", function() {

        beforeEach(function () {
            testMapTransaction = {mapTransaction: function (testMsg) {return testMsg}};
            testValidate = {validateTransaction: function () {return {isValid: false}}};
            spyOn(testLogPlugin, 'error');
            spyOn(testDispose, 'rabbitDispose');

            setTestStubs(testMapTransaction, testValidate, testLogPlugin, testDispose);
            persistTransaction(testMsg);
        });

        it("when transaction validation fails", function () {
            expect(testLogPlugin.error).toHaveBeenCalled();
            expect(testDispose.rabbitDispose).toHaveBeenCalled();
        });
    });
});
