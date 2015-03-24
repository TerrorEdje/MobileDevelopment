var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    userId: { type: String, required: true },
    userFullName: { type: String, required: true},
    name: { type: String},
    courseId: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);