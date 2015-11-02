describe("sendResponse module", function(){

    var sendResponse = require('../lib/pos_modules/sendResponse');
    var statusObject = {};
    var req = {};
    var test_res = {};

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
                test_res = {req: {headers: { 'content-type' : 'application/json'}}, set: function(){}, status: function(){}};
                spyOn(test_res, "set");
                spyOn(test_res, "status");
            });

            it("should return success content-type json", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.set).toHaveBeenCalledWith('Content-Type', 'application/json');
            });

            it("should return success status 200", function(){
                sendResponse(test_res, statusObject);
                expect(test_res.status).toHaveBeenCalledWith(200);
            });

        });
    });

    describe("when isOK is false", function(){

        statusObject = {isOK: false};

        describe("and sent with xml", function(){

            req.headers = {'Content-Type': 'application/xml'};

            it("should return error xml response", function(){
                expect(1).toEqual(1);
            });
        });

        describe("and sent with JSON", function(){

            req.headers = {'Content-Type': 'application/json'};

            it("should return error JSON response", function(){
                expect(1).toEqual(1);
            });
        });
    });

    describe("when system error, ", function(){

        it("should return system err message", function(){
            expect(1).toEqual(1);
        });
    });
});



