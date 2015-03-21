var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classSchema = new Schema({
    name: { type: String},
    classId: { type: String, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Class', classSchema);