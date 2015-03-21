var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    status: { type: Number, required: true }, // 1 = present. 2 = too late. 3 = absent
    classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
    userId: { type: String, required: true },
    userFullName: { type: String, required: true},
    reason: { type: String },
    time: { type: Date, required: true,default: Date.now },
    arrivalTime: { type: Date},	
    location : {
    	type: [Number], // [<longitude>],[<latitude>]
    	index: '2d' // create the geospatial index
    }

});

module.exports = mongoose.model('Attendance', attendanceSchema);