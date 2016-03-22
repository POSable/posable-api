/**
 * Created by davidabramowitz on 3/21/16.
 */
describe("sendResponse module", function(){
    var sendErrorResponse = require('../../lib/pos_modules/sendVoidRefundErrorResponse').sendErrorResponse;
    var statusObject = {};
    var test_res = {};
    var test_req = {};
    var testReqID = 1;
    var testLogPlugin;
    var testObject;

    describe("Set statusObject for proper sendResponse", function(){
        beforeEach(function(){
            statusObject = {isOK: true, success: []};
            testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
            testObject = {testSendResponse: function (){}, testCheckErrorAltResponsePath: function () {}};
            spyOn(testLogPlugin, 'error');
            spyOn(testObject, 'testSendResponse');
            spyOn(testObject, 'testCheckErrorAltResponsePath');
            var testingStub = require('../../lib/pos_modules/sendVoidRefundErrorResponse').testingStub;
            testingStub(testLogPlugin, testObject.testSendResponse, testObject.testCheckErrorAltResponsePath)
        });

        it("should call logPlugin.error, sendResponse and checkErrorAltResponsePath", function(){
            sendErrorResponse(test_req, test_res, statusObject, testReqID);
            expect(testLogPlugin.error).toHaveBeenCalled();
            expect(testObject.testCheckErrorAltResponsePath).toHaveBeenCalled();
            expect(testObject.testSendResponse).toHaveBeenCalled();
        });
    });
});