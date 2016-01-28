describe("Test 'consumeBatchEvent' module & 'handleBatch' function", function() {
    var handleBatchEvent = require('../handlers/consumeBatchEvent').handleBatch;
    describe("A valid message id", function() {
        var err = new Error('test error');
        var merchant = {batchType: 'batch'};
        var testMsg = {body: {internalID: 1}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantLookup: function (id, logPlugin, callback) {
            console.log("$$$", callback);
            callback (undefined, merchant)}};

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantLookup').and.callThrough();
            var setTestStubs = require('../handlers/createLogEntry').testingStub;
            setTestStubs(testLogPlugin, testDispose, testMsg, testConfigPlugin);
        });

        it('logs the id found', function() {    
            handleBatchEvent(testMsg);
            expect(testLogPlugin).to.beCalledWith(logPlugin.debug("Found Internal ID : " + 1));
        });
    });
});

