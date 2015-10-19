var DTO = function (req, res) {
    this.req = req;
    this.res = res;
    this.dto = {};
}

    DTO.prototype.getReqBody = function () {
        var requestBody = this.req.body;

        if  (requestBody === {}) {
            var errDTO1 = new Error();
            errDTO1.message = "Request Body Error";
            this.res.status(406);
            this.res.json({error: errDTO1.message, code: 406});
            return false;

        } else if (this.req.headers['content-type'] === "application/json") {
            this.dto = requestBody;
            console.log('JSON', this.dto);
            return true;
        }
        else if (this.req.headers['content-type'] === "application/xml" ) {
            this.res.set('Content-Type', 'application/xml');
            this.res =
            this.dto = requestBody;
            console.log('XML', this.dto);
            return true;
        } else {
            console.log(this.req.headers['content-type']);
            this.res.status(406);
            this.res.json({error: "Content-Type Error", code: 406});
            return false;
        }

    }

    DTO.prototype.dto = function () {
        return this.dto;
    }

module.exports = DTO;
