var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classSchema = new Schema({
    week: { type: String },
    location: { type: String },
    courseId: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
});

module.exports = mongoose.model('Class', classSchema);