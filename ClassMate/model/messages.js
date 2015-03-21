var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
    userId: { type: String, required: true },
    userFullName: { type: String, required: true},
    message: { type: String, required: true},
    time: { type: Date, default: Date.now }	
});

module.exports = mongoose.model('Message', messageSchema);