var mongoose = require('mongoose');
Course = mongoose.model('Course');
User = mongoose.model('User');
async = require("async");

function fillUsers(callback) {
	User.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating users testdata');
			async.series([
				new User({ name:'Edwin Hattink', local:{ email: 'edwinhattink@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} }).save(),
				new User({ name:'Yorick van Klinken', local:{ email: 'yorick@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} }).save(),
				new User({ name:'Yannik Hegge', local:{ email: 'yannik@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} }).save()
			]);
			callback.push('users');
		} else {
			console.log('Skipping create users testdata, already present');
			callback.push('users');
		}		
	});
}
function fillCourses(callback) {
	Course.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating courses testdata');
			User.findOne({ 'name' : 'Edwin Hattink' }, function (err, doc) {
				new Course({ 
					creator: doc._id,
					name: 'Mobile Development 1',
					description: 'Building hybrid apps',
					participants: [{ user: doc._id }],
					classes: [{
						date: new Date(),
						location: 'OB209',
						description: 'Presentatie',
						messages: [{
							user: doc._id,
							message: 'Usually nobody comes, so who is coming today?'
						}],
						attendances: [{
							user: doc._id
						}]
					}]
				}).save();
			});
			callback.push('courses');
		} else {
			console.log('Skipping create courses testdata, already present');
			callback.push('courses');
		}		
	});
}
function connect(callback) {
	User.findOne({ 'name' : 'Edwin Hattink' }, function (err, doc) {
		if (doc.courses.length == 0) {
			console.log('Creating courses in users testdata');
			Course.findOne({'name' : 'Mobile Development 1'}, function (err, doccourse) {
				doc.courses.push(doccourse._id);
				doc.save();
			});
			callback.push('connected');
		}
		else
		{
			callback.push('connected');
			console.log('Skipping create courses in users testdata, already present');
		}			
	});
}

module.exports = function(){
	var callback = [];
	async.series([
		fillUsers(callback),
		fillCourses(callback),
		connect(callback)
	]);
}