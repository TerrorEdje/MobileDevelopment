var ClassMateApp = require('express')();
var courses = require('../routes/api/courses');
var users = require('../routes/api/users');
var Course = require('mongoose').model('Course');
var User = require('mongoose').model('User');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/classmate');
var bodyParser = require('body-parser');
ClassMateApp.use(bodyParser.json());
ClassMateApp.use(bodyParser.urlencoded({ extended: false }));
ClassMateApp.use(function(req,res,next){
    req.mongoose = mongoose;
    next();
});
ClassMateApp.use('/api/courses',courses);
ClassMateApp.use('/api/users',users);

var request = require('supertest')(ClassMateApp);
var expect = require('chai').expect;
var should = require('chai').should();

var course;
var classe;
var user;
describe('Filling variables', function(){

	it('should fill user var', function(done){
		request.get('/api/users/').expect(200).end(function(err,res) {
			user = res.body.users[0];
			done();
		});
	});

	it('should fill course var', function(done){
		request.get('/api/courses?classes=true&participants=true').expect(200).end(function(err,res) {
			course = res.body.courses[0];
			done();
		});
	});
	it('should fill classe var', function(done){
		request.get('/api/courses/' + course._id + '/classes/').expect(200).end(function(error,result) {
			classe = result.body.classes[0];
			done();
		});
	});

});

describe('Testing courses', function(){
	
	it('should return a 404 status', function(done) {
		request.get('/courses').expect(404).end(function(err,res) {
			done();
		});
	});

	describe('Testing /courses/ GET requests', function() {

		it('should return a course array', function(done){
			request.get('/api/courses/').expect(200).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				(res.body).should.have.property('courses');
		    	done();
			});
		});

		it('should return a course array with classes and participants', function(done){
			request.get('/api/courses?classes=true&participants=true').expect(200).end(function(err,res) {
				if(err) { return done(err); }
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				(res.body).should.have.property('courses');
				(res.body.courses[0]).should.have.property('classes');
				expect(res.body.courses[0].classes).to.be.array;
				(res.body.courses[0]).should.have.property('participants');
				expect(res.body.courses[0].participants).to.be.array;
		    	done();
			});
		});

		it('should return not found', function(done){
			request.get('/api/courses?page=999').expect(404).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				expect(res.body).to.equal('Not found');
		    	done();
			});
		});

		it('should return page has to be a number', function(done){
			request.get('/api/courses?page=lol').expect(400).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				expect(res.body).to.equal('Page has to be a number');
		    	done();
			});
		});
	});
	
	describe('Testing /courses/:id/ GET requests', function () {

		it('should return a course', function(done){
			request.get('/api/courses/' + course._id).expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				done();
			});
		});

		it('should return a course with classes and participants', function(done){
			request.get('/api/courses/' + course._id + "?classes=true&participants=true").expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				(result.body).should.have.property('classes');
				(result.body).should.have.property('participants');
				done();
			});
		});

		it('should return not found', function(done){
			request.get('/api/courses/5534e74dc3d4c47c06f84633').expect(404).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error', function(done){
			request.get('/api/courses/' + course._id + "test").expect(400).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('message');
				done();
			});
		});

		it('should return a course found with subid', function(done){
			request.get('/api/courses/' + course.subId + '?type=subId').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				done();
			});
		});

	});

	describe('Testing /courses/:id/classes/ requests', function () {

		it('should return an array of classes', function(done){
			request.get('/api/courses/' + course._id + '/classes/').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('classes');
				done();
			});
		});

		it('should return an array of classes with attendances and messages', function(done){
			request.get('/api/courses/' + course._id + '/classes?attendances=true&messages=true').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('classes');
				done();
			});
		});

		it('should return an error', function(done){
			request.get('/api/courses/5534e74dc3d4c47c06f84633/classes').expect(404).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error', function(done){
			request.get('/api/courses/5534e74dc3d4c47c06f84633test/classes').expect(400).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('message');
				done();
			});
		});

	});

});
	/*it('should return a course', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id).expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				done();
			});
		});		
	});

	it('should return a full course array in json', function(done){
		request.get('/api/courses/full').expect(200).end(function(err,res) {
			if(err) { return done(err); }
			expect(res.body).to.be.json;
			expect(res.body).to.be.array;
			(res.body).should.have.property('courses');
	    	done();
		});
	});
	it('should return a full course', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id + '/full').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				done();
			});
		});		
	});

	it('should return an array of classes', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id + '/classes/').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.be.array;
				(result.body).should.have.property('classes');
				done();
			});
		});		
	});
	it('should return a class', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id + '/classes/').expect(200).end(function(error,result) {
				console.log(result.body);
				console.log('/api/courses/' + res.body.courses[0]._id + '/classes/');
				request.get('/api/courses/' + res.body.courses[0]._id + '/classes/' + result.body.classes[0]._id).expect(200).end(function(error,response) {
					if (error) { return done(error); }
					expect(response.body).to.be.json;
					(response.body).should.have.property('_id');
					done();
				});
			});
		});		
	});
	it('should return an array of participants', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id + '/participants/').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.be.array;
				(result.body).should.have.property('participants');
				done();
			});
		});		
	});
	it('should return an array of messages', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id + '/classes/').expect(200).end(function(error,result) {
				request.get('/api/courses/' + res.body.courses[0]._id + '/classes/'+ result.body.classes[0]._id + '/messages/').expect(200).end(function(error,data) {
					if (error) { return done(error); }
					expect(data.body).to.be.json;
					expect(data.body).to.be.array;
					(data.body).should.have.property('messages');
					done();
				});
			});
		});		
	});
	it('should return an array of attendances', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id + '/classes/').expect(200).end(function(error,result) {
				request.get('/api/courses/' + res.body.courses[0]._id + '/classes/'+ result.body.classes[0]._id + '/attendances/').expect(200).end(function(error,data) {
					if (error) { return done(error); }
					expect(data.body).to.be.json;
					expect(data.body).to.be.array;
					(data.body).should.have.property('attendances');
					done();
				});
			});
		});		
	});*/
//});

/*describe('Testing users GET requests', function(){
	it('should return users', function(done){
		request.get('/api/users/').expect(200).end(function(err,res) {
			if (err) { return done(err); }
			expect(res.body).to.be.json;
			(res.body).should.have.property('users');
			done();
		});
	});

	it('should return a user', function(done){
		request.get('/api/users/').expect(200).end(function(err,res) {
			request.get('/api/users/' + res.body.users[0]._id).expect(200).end(function(err,res) {
				if (err) { return done(err); }
				expect(res.body).to.be.json;
				(res.body).should.have.property('_id');
				done();
			});
		});
	});
});

describe('Testing POST, PUT and DELETE requests', function(){
	var course;
	var classe;
	var user;
	it('should fill user var', function(done){
		request.get('/api/users/').expect(200).end(function(err,res) {
			user = res.body.users[0];
			done();
		});
	});

	it('should fill course var', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			course = res.body.courses[0];
			done();
		});
	});
	it('should fill classe var', function(done){
		request.get('/api/courses/' + course._id + '/classes/').expect(200).end(function(error,result) {
			classe = result.body.classes[0];
			done();
		});
	});

	it('should subscribe a user to a course', function(done) {
		request.get('/api/users/' + user._id + 'courses').send('_id' + course._id).expect(200).end(function(err,res){
			console.log(res.body);
			(res.body).should.have.property('message','Course added to User and User added to Course.');
			done();
		});
	});

	it('should add a new message', function(done){
		request.post('/api/courses/' + course._id + '/classes/' + classe._id + '/messages').send('user='+ user._id).send('message','This is a new test message').expect(201).end(function(err, res){
			(res.body).should.have.property('message','Message added');
			done();			
		});
	});

	it('should add a new attendance', function(done){
		request.post('/api/courses/' + course._id + '/classes/' + classe._id + '/attendances').send('user='+ user._id).expect(201).end(function(err, res){
			(res.body).should.have.property('message','Attendance added');
			done();			
		});
	});

	it('should add a new participant', function(done){
		request.post('/api/courses/' + course._id + '/participants').send('user='+ user._id).expect(201).end(function(err, res){
			(res.body).should.have.property('message','Participant added');
			done();			
		});
	});

	it('should add a new course', function(done){
		request.post('/api/courses/').send('creator=' + user._id).send('name=MobileDevelopment1').send('description=Buildinghybridapps').expect(201).end(function(err, res){
			(res.body).should.have.property('message','Course added');
			done();			
		});
	});

	it('should add a new user', function(done){
		request.post('/api/users/').send('name=Edwin Hattink').expect(201).end(function(err, res){
			(res.body).should.have.property('message','User added');
			done();			
		});
	});

	it('should update a course', function(done){
		course.name = 'mobile development 500';
		request.put('/api/courses/' + course._id).send(course).expect(200).end(function(err, res){
			(res.body).should.have.property('message','Course updated');
			done();			
		});
	});

	it('should delete a course', function(done) {
		request.post('/api/courses/').send('creator=' + user._id).send('name=MobileDevelopment1').send('description=Buildinghybridapps').expect(201).end(function(err, res){
			request.get('/api/courses/').expect(200).end(function(err,res) {
				var lookup;
      			for (var i = 0, len = res.body.courses.length; i < len; i++) {
      				if (res.body.courses[i].name == 'MobileDevelopment1') { lookup = res.body.courses[i]; }
      			}
				request.delete('/api/courses/' + lookup._id).expect(200).end(function(err,res) {
					(res.body).should.have.property('message','Course deleted');
					done();	
				});
			});		
		});
	});

	it('should delete a user', function(done) {
		request.post('/api/users/').send('name=Edwin Hattink').expect(200).end(function(err, res){
			request.get('/api/users/').expect(200).end(function(err,res) {
				var lookup;
      			for (var i = 0, len = res.body.users.length; i < len; i++) {
      				if (res.body.users[i].name == 'Edwin Hattink') { lookup = res.body.users[i]; }
      			}
				request.delete('/api/users/' + lookup._id).expect(200).end(function(err,res) {
					(res.body).should.have.property('message','User deleted');
					done();	
				});			
			});		
		});
	});
});*/