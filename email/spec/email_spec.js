var sendMail = require('../email').sendMail;



describe("Test email module", function(){

    beforeEach(function() {}
    );

    it("should send email", function(done) {
        var callback = function(){done()};
        sendMail("sendMail test message", {}, callback, 'david.xesllc@gmail.com');
    });
});

