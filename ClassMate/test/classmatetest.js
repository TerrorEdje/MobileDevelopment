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
			user = res.body.users[1];
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

		it('should return not found', function(done){
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

	describe('Testing /courses/:id/classes/:cid/ requests', function() {

		it('should return a class with attendances and messages', function(done) {
			request.get('/api/courses/' + course._id + '/classes/' + classe._id + '?messages=true&attendances=true').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				(result.body).should.have.property('messages');
				(result.body).should.have.property('messages');
				done();
			});
		});

		it('should return a class without attendances and messages', function(done) {
			request.get('/api/courses/' + course._id + '/classes/' + classe._id).expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				expect(result.body.messages).to.be.an('undefined');
				expect(result.body.attendances).to.be.an('undefined');
				done();
			});
		});

		it('should return not found', function(done){
			request.get('/api/courses/5534e74dc3d4c47c06f84633/classes/5534e74dc3d4c47c06f84633/').expect(404).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error', function(done){
			request.get('/api/courses/5534e74dc3d4c47c06f84633test/classes/test').expect(400).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('message');
				done();
			});
		});

		it('should not found', function(done){
			request.get('/api/courses/' + course._id + '/classes/5534e74dc3d4c47c06f84633').expect(404).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.equal('Not found');
				done();
			});
		});

	});

	describe('Testing /courses/:id/classes/:cid/ POST requests', function() {

		it('should add a message', function(done) {
			var message = { user: user._id, message: "This is an automated test" };
			request.post('/api/courses/' + course._id + '/classes/' + classe._id + '?type=message').send(message).expect(201).end(function(error,result) {
				expect(result.body).to.equal('Message added');
				done();	
			});
		});

		it('should add an attendance', function(done) {
			var message = { user: user._id, reason: "This is an automated test", attendance: 2 };
			request.post('/api/courses/' + course._id + '/classes/' + classe._id + '?type=attendance').send(message).expect(201).end(function(error,result) {
				expect(result.body).to.equal('Attendance added');
				done();	
			});
		});

		it('should return missing type', function(done) {
			var message = { user: user._id, reason: "This is an automated test", attendance: 2 };
			request.post('/api/courses/' + course._id + '/classes/' + classe._id).send(message).expect(400).end(function(error,result) {
				expect(result.body).to.equal('Missing type');
				done();	
			});
		});

		it('should return wrong type', function(done) {
			var message = { user: user._id, reason: "This is an automated test", attendance: 2 };
			request.post('/api/courses/' + course._id + '/classes/' + classe._id + '?type=wrongtype').send(message).expect(400).end(function(error,result) {
				expect(result.body).to.equal('Wrong type');
				done();	
			});
		});


		it('should return an error', function(done) {
			var message = { user: user._id, message: "This is an automated test" };
			request.post('/api/courses/' + course._id + 'test/classes/' + classe._id + '?type=message').send(message).expect(400).end(function(error,result) {
				expect(result.body).to.be.json;
				(result.body).should.have.property('message');
				done();	
			});
		});

		it('should return not found', function(done) {
			var message = { user: user._id, message: "This is an automated test" };
			request.post('/api/courses/5534e74dc3d4c47c06f84633/classes/' + classe._id + '?type=message').send(message).expect(400).end(function(error,result) {
				expect(result.body).to.equal('Not found');
				done();	
			});
		});

		it('should return a validation error', function(done) {
			var message = { reason: "This is an automated test", attendance: 2 };
			request.post('/api/courses/' + course._id + '/classes/' + classe._id + '?type=attendance').send(message).expect(400).end(function(error,result) {
				expect(result.body.name).to.equal('ValidationError');
				done();
			});
		});

	});

	describe('Testing /courses/:id/ POST requests', function() {

		it('should add a class',function(done) {
			var classee = { location: "OB202", description: "This is an automated test"};
			request.post('/api/courses/' + course._id).send(classee).expect(201).end(function(error,result) {
				expect(result.body).to.equal('Class added');
				done();
			});
		});

		it('should return an error',function(done) {
			var classee = { location: "OB202", description: "This is an automated test"};
			request.post('/api/courses/test' + course._id).send(classee).expect(400).end(function(error,result) {
				(result.body).should.have.property('message');
				done();
			});
		});

		it('should return not found',function(done) {
			var classee = { location: "OB202", description: "This is an automated test"};
			request.post('/api/courses/5534e74dc3d4c47c06f84633').send(classee).expect(400).end(function(error,result) {
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return a validation error',function(done) {
			var classee = { date: "hoi", location: "OB202", description: "This is an automated test"};
			request.post('/api/courses/' + course._id).send(classee).expect(400).end(function(error,result) {
				expect(result.body.name).to.equal('ValidationError');
				done();
			});
		});

	});

	describe('Testing /courses/ PUT requests', function() {

		var coursebroken;
		it('should fill coursebroken var', function(done){
			request.get('/api/courses?classes=true&participants=true').expect(200).end(function(err,res) {
				coursebroken = res.body.courses[0];
				done();
			});
		});

		it('should update a course',function(done) {
			request.put('/api/courses/').send(course).expect(200).end(function(err, result){
				expect(result.body).to.equal('Course updated');
				done();			
			});
		});

		it('should return an error (bad course send)',function(done) {
			coursebroken.creator = 'test';
			request.put('/api/courses/').send(coursebroken).expect(400).end(function(err, result){
				(result.body).should.have.property('message');
				done();			
			});
		});

		it('should return an error (cannot find the course)',function(done) {
			coursebroken._id = coursebroken._id + 'test';
			request.put('/api/courses/').send(coursebroken).expect(400).end(function(err, result){
				(result.body).should.have.property('message');
				done();			
			});
		});

		it('should return not found',function(done) {
			coursebroken._id =  '5534e74dc3d4c47c06f84633';
			request.put('/api/courses/').send(coursebroken).expect(404).end(function(err, result){
				expect(result.body).to.equal('Not found');
				done();			
			});
		});

	});

	describe('Testing /courses/ POST requests', function() {

		it('should add a course',function(done) {
			postcourse = { creator: user._id, name: "This is an automated test.", description: "This is an automated test." };
			request.post('/api/courses/').send(postcourse).expect(201).end(function(err, result){
				expect(result.body).to.equal('Course added');
				done();
			});
		});

		it('should return an validation error',function(done) {
			postcourse = { creator: user._id, description: "This is an automated test." };
			request.post('/api/courses/').send(postcourse).expect(201).end(function(err, result){
				expect(result.body.name).to.equal('ValidationError');
				done();
			});
		});

	});

	describe('Testing /courses/:id/ DELETE requests', function() {

		var coursedelete;

		it('should add a course',function(done) {
			postcourse = { creator: user._id, name: "This is an automated test.", description: "This is an automated test." }
			request.post('/api/courses/').send(postcourse).expect(201).end(function(err, result){
				expect(result.body).to.equal('Course added');
				done();
			});
		});

		it('should fill coursedelete var', function(done){
			request.get('/api/courses?classes=true&participants=true').expect(200).end(function(err,result) {
				coursedelete = result.body.courses[1];
				done();
			});
		});

		it('should delete a course',function(done) {
			request.delete('/api/courses/' + coursedelete._id).expect(200).end(function(err,result) {
				expect(result.body).to.equal('Course deleted');
				done();
			});
		});

		it('should return not found',function(done) {
			request.delete('/api/courses/5534e74dc3d4c47c06f84633').expect(404).end(function(err,result) {
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error',function(done) {
			request.delete('/api/courses/5534e74dc3d4c47c06f84633test').expect(400).end(function(err,result) {
				(result.body).should.have.property('message');
				done();
			});
		});

	});

	describe('Testing /courses/:id/classes/:cid/ DELETE requests', function() {

		var coursedelete;

		it('should add a course with a class',function(done) {
			postcourse = { creator: user._id, name: "This is an automated test.", description: "This is an automated test.",classes: [{
								date: new Date(),
								location: 'OB209',
								description: 'Presentatie',
								messages: [{
									user: user._id,
									message: 'Usually nobody comes, so who is coming today?'
								}],
								attendances: [{
									user: user._id
								}]
							}] };
			request.post('/api/courses/').send(postcourse).expect(201).end(function(err, result){
				expect(result.body).to.equal('Course added');
				done();
			});
		});

		it('should fill coursedelete var', function(done){
			request.get('/api/courses?classes=true&participants=true').expect(200).end(function(err,result) {
				coursedelete = result.body.courses[result.body.courses.length-1];
				done();
			});
		});

		it('should delete a class',function(done) {
			request.delete('/api/courses/' + coursedelete._id + '/classes/' + coursedelete.classes[0]._id).expect(200).end(function(err,result) {
				expect(result.body).to.equal('Class deleted');
				done();
			});
		});

		it('should return not found',function(done) {
			request.delete('/api/courses/5534e74dc3d4c47c06f84633/classes/5534e74dc3d4c47c06f84633').expect(404).end(function(err,result) {
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error',function(done) {
			request.delete('/api/courses/5534e74dc3d4c47c06f84633test/classes/5534e74dc3d4c47c06f84633').expect(400).end(function(err,result) {
				(result.body).should.have.property('message');
				done();
			});
		});

		it('should return an error',function(done) {
			request.delete('/api/courses/'+ coursedelete._id +'/classes/5534e74dc3d4c47c06f84633').expect(404).end(function(err,result) {
				expect(result.body).to.equal('Not found');
				done();
			});
		});
	});
});
describe('Testing users', function(){

	describe('Testing /courses/ GET requests', function() {

		it('should return a user array', function(done){
			request.get('/api/users/').expect(200).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				(res.body).should.have.property('users');
			   	done();
			});
		});

		it('should return a user array with courses', function(done){
			request.get('/api/users?courses=true').expect(200).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				(res.body).should.have.property('users');
				(res.body.users[1]).should.have.property('courses');
				expect(res.body.users[1].courses).to.be.array;
			   	done();
			});
		});

		it('should return not found', function(done){
			request.get('/api/users?page=999').expect(404).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				expect(res.body).to.equal('Not found');
		    	done();
			});
		});

		it('should return page has to be a number', function(done){
			request.get('/api/users?page=lol').expect(400).end(function(err,res) {
				expect(res.body).to.be.json;
				expect(res.body).to.be.array;
				expect(res.body).to.equal('Page has to be a number');
		    	done();
			});
		});
	});

	describe('Testing /users/ GET requests', function() {

		it('should return a user', function(done){
			request.get('/api/users/' + user._id).expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				done();
			});
		});

		it('should return a user with courses', function(done){
			request.get('/api/users/' + user._id + "?courses=true").expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				(result.body).should.have.property('courses');
				done();
			});
		});

		it('should return not found', function(done){
			request.get('/api/users/5534e74dc3d4c47c06f84633').expect(404).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error', function(done){
			request.get('/api/users/' + user._id + "test").expect(400).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('message');
				done();
			});
		});

		it('should return a user found with subid', function(done){
			request.get('/api/users/' + user.subId + '?type=subId').expect(200).end(function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('_id');
				done();
			});
		});

	});

	describe('Testing /users/ PUT requests', function() {

		var userbroken;
		it('should fill userbroken var', function(done){
			request.get('/api/users?courses=true').expect(200).end(function(err,res) {
				userbroken = res.body.users[0];
				done();
			});
		});

		it('should update a course',function(done) {
			request.put('/api/users/').send(user).expect(200).end(function(err, result){
				expect(result.body).to.equal('User updated');
				done();			
			});
		});

		it('should return an error (cannot find the user)',function(done) {
			userbroken._id = userbroken._id + 'test';
			request.put('/api/users/').send(userbroken).expect(400).end(function(err, result){
				(result.body).should.have.property('message');
				done();			
			});
		});

		it('should return not found',function(done) {
			userbroken._id =  '5534e74dc3d4c47c06f84633';
			request.put('/api/users/').send(userbroken).expect(404).end(function(err, result){
				expect(result.body).to.equal('Not found');
				done();			
			});
		});

	});

	describe('Testing /users/ POST requests', function() {

		it('should add a course',function(done) {
			postuser = { name: "This is an automated test." };
			request.post('/api/users/').send(postuser).expect(201).end(function(err, result){
				expect(result.body).to.equal('User added');
				done();
			});
		});

		it('should return an validation error',function(done) {
			postuser = { };
			request.post('/api/users/').send(postuser).expect(201).end(function(err, result){
				expect(result.body.name).to.equal('ValidationError');
				done();
			});
		});

	});

	describe('Testing /users/:id/courses',function() {

		var usercourse;
		it('should fill usercourse var', function(done){
			request.get('/api/users?courses=true').expect(200).end(function(err,res) {
				usercourse = res.body.users[res.body.users.length-1];
				done();
			});
		});

		it('should return user already subscribed to course', function(done) {
			request.post('/api/users/' +  user._id + '/courses').send({ id: course.subId }).expect(400).end(function(err,result) {
				expect(result.body).to.equal('User already subscribed to course.');
				done();
			});
		});

		it('should subscribe user to course', function(done) {
			request.post('/api/users/' +  usercourse._id + '/courses').send({ id: course.subId }).expect(200).end(function(err,result) {
				expect(result.body).to.equal('User subscribed to course.');
				done();
			});
		});

		it('should return user not found ', function(done) {
			request.post('/api/users/5534e74dc3d4c47c06f84633/courses').send({ id: course.subId }).expect(404).end(function(err,result) {
				expect(result.body).to.equal('User not found.');
				done();
			});
		});

		it('should return course not found', function(done) {
			request.post('/api/users/' +  usercourse._id + '/courses').send({ id: course.subId + 'test' }).expect(404).end(function(err,result) {
				expect(result.body).to.equal('Course not found.');
				done();
			});
		});

		it('should return an error', function(done) {
			request.post('/api/users/' +  usercourse._id + 'test/courses').send({ id: course.subId }).expect(400).end(function(err,result) {
				(result.body).should.have.property('message');
				done();
			});
		});

	});

	describe('Testing /users/:id/ DELETE requests', function() {

		var userdelete;

		it('should add a user',function(done) {
			postuser = { name: "This is an automated test."}
			request.post('/api/users/').send(postcourse).expect(201).end(function(err, result){
				expect(result.body).to.equal('User added');
				done();
			});
		});

		it('should fill userdelete var', function(done){
			request.get('/api/users?classes=true&participants=true').expect(200).end(function(err,result) {
				userdelete = result.body.users[4];
				done();
			});
		});

		it('should delete a course',function(done) {
			request.delete('/api/users/' + userdelete._id).expect(200).end(function(err,result) {
				expect(result.body).to.equal('User deleted');
				done();
			});
		});

		it('should return not found',function(done) {
			request.delete('/api/users/5534e74dc3d4c47c06f84633').expect(404).end(function(err,result) {
				expect(result.body).to.equal('Not found');
				done();
			});
		});

		it('should return an error',function(done) {
			request.delete('/api/users/5534e74dc3d4c47c06f84633test').expect(400).end(function(err,result) {
				(result.body).should.have.property('message');
				done();
			});
		});

	});


});