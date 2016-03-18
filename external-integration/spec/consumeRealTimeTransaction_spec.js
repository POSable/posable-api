describe("Test 'consumeRealTimeTransaction' module & 'handleRealTimeTransaction' function", function() {
    var handleRealTimeTransaction = require('../handlers/consumeTransaction').handleRealTimeTransaction;
    var setTestStubs = require('../handlers/consumeTransaction').testingStub;
    var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
    var testDispose ={rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
    var testMsg = {body: {internalID: 1}};

    describe("when a system error is raised", function() {
            var err;
        beforeEach(function () {
            err = new Error('Test System Error');
            var testObject = {testPostProcedure: function () {throw err}};
            spyOn(testObject, 'testPostProcedure').and.callThrough();
            spyOn(testLogPlugin, 'debug');
            spyOn(testLogPlugin, 'error');
            spyOn(testDispose, 'rabbitDispose');
            setTestStubs(testLogPlugin, testDispose);
        });

        it("catches the error then throws it to the calling code", function () {
            try {
                handleRealTimeTransaction(testMsg);
            } catch (err) {
                expect(err).not.toBeNull();
            }
        });

        //it("disposes the message with dead letter set to true", function () {
        //    try {
        //        handleRealTimeTransaction(testMsg);
        //    } catch (err) {
        //        expect(err.deadLetter).toBe(true);
        //    }
        //});

        it("logs the system error.", function () {
            try {
                handleRealTimeTransaction(testMsg);
            } catch (err) {
                expect(testLogPlugin.error).toHaveBeenCalledWith(err);
            }
        });
    });
});
