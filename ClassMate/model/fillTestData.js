var async = require('async');

function saveCallback(err){
	if (err){
		console.log('Fill testdata failed, reason: %s', err);
	}
};

function fillTestClasses(callback){
	Class.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating classes testdata');
			Course.findOne({ 'courseId' : 'AII-1415C-INMBD1' }, function (err, doc) {
				new Class({ week:'1', location:'OB204', courseId:doc._id }).save(saveCallback);
				new Class({ week:'2', location:'OB204', courseId:doc._id }).save(saveCallback);
				new Class({ week:'3', location:'OB204', courseId:doc._id }).save(saveCallback);
			});
		} else {
			console.log('Skipping create classes testdata, already present');
		}		
		if(callback) { callback(); }
	});
};

function fillTestCourses(callback){
	
Course.batchInsert([], function(err){ callback(); })
	Course.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating courses testdata');
			new Course({ userFullName:'Edwin Hattink', userId:'egjhatti@avans.nl', name:'Mobile Development 1', courseId:'AII-1415C-INMBD1', description:'Hybrid smartphone apps bouwen' }).save(saveCallback);
			new Course({ userFullName:'Edwin Hattink', userId:'egjhatti@avans.nl', name:'Cloud Services', courseId:'AII-1415C-INWEBS5', description:'Cloud services bouwen' }).save(saveCallback);
			new Course({ userFullName:'Edwin Hattink', userId:'egjhatti@avans.nl', name:'Mobile Development 2', courseId:'AII-1415C-INMBD2', description:'Native smartphone apps bouwen' }).save(saveCallback);
		} else {
			console.log('Skipping create courses testdata, already present');
		}		
		if(callback) { callback(); }
	});
};

function fillTestAttendances(callback){ 
	Attendance.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating attendances testdata');
			Class.findOne({ 'week' : '1' }, function (err, doc) {
				new Attendance({userId:'egjhatti@avans.nl', status: 1, classId: doc._id, userFullName: 'Edwin Hattink', reason: ''}).save(saveCallback);
				new Attendance({userId:'yahegge@avans.nl', status: 2, classId: doc._id, userFullName: 'Yannik Hegge', reason: 'Overslept'}).save(saveCallback);
				new Attendance({userId:'ymvanklinken@avans.nl', status: 3, classId: doc._id, userFullName: 'Yorick van Klinken', reason: 'Too lazy'}).save(saveCallback);
			});		
		} else {
			console.log('Skipping create attendances testdata, already present');
		}		
		if(callback) { callback(); }
	});
};

function fillTestMessages(callback){
	Message.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating messages testdata');
			Class.findOne({ 'week' : '1' }, function (err, doc) {
				new Message({userId:'egjhatti@avans.nl', classId: doc._id, userFullName: 'Edwin Hattink', message: 'Who is coming to Mobile Development today?'}).save(saveCallback);
				new Message({userId:'yahegge@avans.nl', classId: doc._id, userFullName: 'Yannik Hegge', message: 'Damnit it, I had too much beer last night so I overslept'}).save(saveCallback);
				new Message({userId:'ymvanklinken@avans.nl', classId: doc._id, userFullName: 'Yorick van Klinken', message: 'Meh, I do not care about this class so I am not coming'}).save(saveCallback);
			});		
		} else {
			console.log('Skipping create messages testdata, already present');
		}	
		if(callback) { callback(); }
	});
};

module.exports = function(mongoose){
	Attendance = mongoose.model('Attendance');
	Message = mongoose.model('Message');
	Class = mongoose.model('Class');
	Course = mongoose.model('Course');
	
	async.waterfall(
		fillTestCourses,
		fillTestClasses,
		fillTestMessages,
		fillTestAttendances
		);
}