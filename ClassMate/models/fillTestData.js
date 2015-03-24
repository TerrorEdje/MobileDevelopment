var async = require('async');

function saveCallback(err){
	if (err){
		console.log('Fill testdata failed, reason: %s', err);
	}
};

function fillTestData(callback){
	Course.find({}, function(err,data){
		if(data.length == 0){
			console.log('Creating users testdata');
			new User({ name:'Edwin Hattink', local:{ email: 'edwinhattink@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} }).save(saveCallback);
			new User({ name:'Yorick van Klinken', local:{ email: 'yorick@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} }).save(saveCallback);
			new User({ name:'Yannik Hegge', local:{ email: 'yannik@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} }).save(saveCallback);
		} else {
			console.log('Skipping create users testdata, already present');
		}		
	});
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
						message: [{
							user: doc._id,
							message: 'Usually nobody comes, so who is coming today?',
						}],
						attendances: [{
							user: doc._id
						}]
					}]
				}).save(saveCallback);
			});
		} else {
			console.log('Skipping create courses testdata, already present');
		}		
		User.findOne({ 'name' : 'Edwin Hattink' }, function (err, doc) {
			Course.findOne({'name' : 'Mobile Development 1'}, function (err, doccourse) {
				doc.courses.push(doccourse._id);
				doc.save(saveCallback);
			});
		});
		if(callback) { callback(); }
	});
};

module.exports = function(mongoose){
	Course = mongoose.model('Course');
	User = mongoose.model('User');

	fillTestData();
}