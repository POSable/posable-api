var mongoose = require('mongoose');

var PayloadAuditSchema = new mongoose.Schema({
    payload: Object
});

module.exports = {
    model : mongoose.model('PayloadAudit', PayloadAuditSchema)
};