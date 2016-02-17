describe("Test 'consumeBatchEvent' module & 'handleBatch' function", function() {
    var handleBatchEvent = require('../handlers/consumeBatchEvent').handleBatch;
    describe("A valid message id", function() {
        var merchant = {batchType: 'batch'};
        var testMsg = {body: {internalID: 1}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantSearch: function (id, callback) {
            callback (undefined, merchant)}};
        var testObject = {accountingBatchMap: function(msg, merchant) {
        }};

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantSearch').and.callThrough();
            spyOn(testObject, 'accountingBatchMap').and.callThrough();
            var setTestStubs = require('../handlers/consumeBatchEvent').testingStub;
            setTestStubs(testLogPlugin, testDispose, testConfigPlugin, testObject.accountingBatchMap);
        });

        it('finds the id in the message and logs it', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith("Found Internal ID : " + 1);
        });

        it('finds the id related merchant', function() {
            handleBatchEvent(testMsg);
            expect(testConfigPlugin.merchantSearch).toHaveBeenCalled();
        });


        it('logs that asych function merchantSearch finished and calls accountingBatchMap', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Merchant search finished');
        });


        it('logs that asych function merchanSearch finished and calls accountingBatchMap for a batch merchant', function() {
            handleBatchEvent(testMsg);
            expect(testObject.accountingBatchMap).toHaveBeenCalled();

        });

    });


    describe("System Error", function() {
        var merchant = {batchType: 'batch'};
        var testMsg = {body: {internalID: 1}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantSearch: function (id, callback) {
            callback (undefined, merchant)}};
        var testObject = {accountingBatchMap: function(msg, merchant) {
            throw new Error('This is a test error');
        }};

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantSearch').and.callThrough();
            spyOn(testObject, 'accountingBatchMap').and.callThrough();
            var setTestStubs = require('../handlers/consumeBatchEvent').testingStub;
            setTestStubs(testLogPlugin, testDispose, testConfigPlugin, testObject.accountingBatchMap);
        });

        it('it catches and logs them and dead letters the message, then throws an error to the calling code', function() {
            try {
                handleBatchEvent(testMsg);
            } catch (err) {
                expect(testLogPlugin.error).toHaveBeenCalledWith(err);
                expect(err.deadLetter).toBe(true);
                expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, err);
            }
        });
    });
});

