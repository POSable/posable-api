describe("Test 'consumeRealTimeTransaction' module & 'handleRealTimeTransaction' function", function() {
    var handleRealTimeTransaction = require('../handlers/consumeRealTimeTransaction').handleRealTimeTransaction;
    var setTestStubs = require('../handlers/consumeRealTimeTransaction').testingStub;
    var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};;
    var testDispose ={rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
    var testObject = {testPostProcedure: function (msg, callback) {callback()}};
    var testMsg = {}

    describe("should properly execute postProcedure function", function() {
        beforeEach(function () {
            spyOn(testObject, 'testPostProcedure').and.callThrough();
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            setTestStubs(testLogPlugin, testDispose, testObject.testPostProcedure, testMsg);
        });

        it("function is called msg", function () {
            handleRealTimeTransaction(testMsg);
            expect(testObject.testPostProcedure).toHaveBeenCalled();

        });

        it("Should dispose of the message without an error argument", function () {
            handleRealTimeTransaction(testMsg);
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, null);

        });

        it("Should log the handler - finished successfully", function () {
            handleRealTimeTransaction(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('handleRealTimeTransaction successfully finished');
        });
    });

    describe("when postProcedure does not execute properly", function() {
        var err;
        beforeEach(function () {
            err = new Error('Error Test Message');
            var testObject = {testPostProcedure: function (msg, callback) {callback(err)}};
            spyOn(testObject, 'testPostProcedure').and.callThrough();
            spyOn(testLogPlugin, 'debug');
            spyOn(testLogPlugin, 'error');
            spyOn(testDispose, 'rabbitDispose');
            setTestStubs(testLogPlugin, testDispose, testObject.testPostProcedure, testMsg);
        });

        it("returns an err object with a deadLetter property set to true", function () {
            handleRealTimeTransaction(testMsg);
            expect(err.deadLetter).toBe(true);
        });

        it("disposes the message with an error", function () {
            handleRealTimeTransaction(testMsg);
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, err);
        });

        it("logs the error.", function () {
            handleRealTimeTransaction(testMsg);
            expect(testLogPlugin.error).toHaveBeenCalledWith(err);
        });
    });
    describe("when a system error is raised", function() {
            var err;
        beforeEach(function () {
            err = new Error('Test System Error');
            var testObject = {testPostProcedure: function () {throw err}};
            spyOn(testObject, 'testPostProcedure').and.callThrough();
            spyOn(testLogPlugin, 'debug');
            spyOn(testLogPlugin, 'error');
            spyOn(testDispose, 'rabbitDispose');
            setTestStubs(testLogPlugin, testDispose, testObject.testPostProcedure, testMsg);
        });

        it("catches the error then throws it to the calling code", function () {
            try {
                handleRealTimeTransaction(testMsg);
            } catch (err) {
                expect(err).not.toBeNull();
            }
        });

        it("disposes the message with dead letter set to true", function () {
            try {
                handleRealTimeTransaction(testMsg);
            } catch (err) {
                expect(err.deadLetter).toBe(true);
            }
        });

        it("logs the system error.", function () {
            try {
                handleRealTimeTransaction(testMsg);
            } catch (err) {
                expect(testLogPlugin.error).toHaveBeenCalledWith(err);
            }
        });
    });
});
