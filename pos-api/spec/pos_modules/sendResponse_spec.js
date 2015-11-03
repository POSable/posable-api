describe("sendResponse module", function(){

    var sendResponse = require('../../lib/pos_modules/sendResponse');
    var statusObject = {};
    var test_res = {};
    //var test_err = {};

    describe("when isOK is true", function(){
        describe("and sent with xml", function(){
            beforeEach(function(){
                statusObject = {isOK: true, success: []};
                test_res = {req: {headers: { 'content-type' : 'application/xml'}}, set: function(){}, status: function(){}, send: function(){}};
                spyOn(test_res, "set");
                spyOn(test_res, "status");
                spyOn(test_res, "send");
            });

            it("should return success content-type xml", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.set).toHaveBeenCalledWith('Content-Type', 'application/xml');
            });

            it("should return success status 200", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.status).toHaveBeenCalledWith(200);
            });

            it("should return success send", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.send).toHaveBeenCalled();
            });
        });

        describe("and sent with JSON", function(){
            beforeEach(function(){
                statusObject = {isOK: true, success: []};
                test_res = {req: {headers: { 'content-type' : 'application/json'}}, set: function(){}, status: function(){
                    return test_res;
                }, json: function(){}};
                spyOn(test_res, "set");
                spyOn(test_res, "status")
                spyOn(test_res, "json")
            });

            it("should return success content-type json", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.set).toHaveBeenCalledWith('Content-Type', 'application/json');
            });

            it("should return success status 200", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.status).toHaveBeenCalledWith(200);
            });

            it("should return success with JSON", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.status).toHaveBeenCalled();
            });

        });
    });

    describe("when isOK is false", function(){
        describe("and sent with xml", function(){
            beforeEach(function(){
                statusObject = {isOK: false, error: {error: {code: 400}}};
                test_res = {req: {headers: { 'content-type' : 'application/xml'}}, status: function(){}, send: function(){}};
                spyOn(test_res, "status");
                spyOn(test_res, "send");
            });

            it("should return error status 400", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.status).toHaveBeenCalledWith(400);
            });

            it("should return success send", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.send).toHaveBeenCalled();
            });
        });


        describe("and sent with JSON", function(){
            beforeEach(function(){
                statusObject = {isOK: false, error: {error: {code: 400}}};
                test_res = {req: {headers: { 'content-type' : 'application/json'}}, status: function(){
                    return statusObject.error
                }, json: function(){}};
                spyOn(test_res, "status")
                spyOn(test_res, "json")
            });


            it("should return error status 400", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.status).toHaveBeenCalledWith(400);
            });
        });
    });

    //describe("when system error, ", function(){
    //    beforeEach(function(){
    //        test_err = { status: function(){
    //            return test_err.status;
    //        }};
    //        spyOn(test_err, "status").and.throwError(500);
    //    });
    //
    //    it("should return system err message", function(){
    //        sendResponse(test_err, statusObject);
    //        expect(test_err.status).toHaveBeenCalledWith(500);
    //    });
    //
    //});
});



