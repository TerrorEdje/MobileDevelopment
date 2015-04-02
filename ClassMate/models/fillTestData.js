var mongoose = require('mongoose');
Course = mongoose.model('Course');
User = mongoose.model('User');
async = require("async");

function fillTestData()
{
    User.find({}, function(err,data){
        if(data.length == 0){
			var user1 = new User({ name:'Edwin Hattink', local:{ email: 'edwinhattink@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} });
			var user2 =	new User({ name:'Yorick van Klinken', local:{ email: 'yorick@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} });
			var user3 =	new User({ name:'Yannik Hegge', local:{ email: 'yannik@me.com', password: '$2a$08$/enbBytoLjCtPamq.DzB9eNlrI2YZ4CcuN6LJwNkwJ17Ro17UbKrC'} });

			var course = new Course({ 
							creator: user1._id,
							name: 'Mobile Development 1',
							description: 'Building hybrid apps',
							participants: [ user1._id ],
							classes: [{
								date: new Date(),
								location: 'OB209',
								description: 'Presentatie',
								messages: [{
									user: user1._id,
									message: 'Usually nobody comes, so who is coming today?'
								}],
								attendances: [{
									user: user1._id
								}]
							}]
						});

			user1.courses.push(course._id);

			user1.save();
			user2.save();
			user3.save();
			course.save();
			console.log('Database filled');
		}
		else
		{
			console.log('Skipping to fill Database');
		}
	});
}

module.exports = function(){
	fillTestData();
}