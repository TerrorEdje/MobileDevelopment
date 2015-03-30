var ClassMateApp = require('express')();
var courses = require('../routes/courses');
var users = require('../routes/users');
var Course = require('mongoose').model('Course');
var User = require('mongoose').model('User');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/classmate');
ClassMateApp.use(function(req,res,next){
    req.mongoose = mongoose;
    next();
});
ClassMateApp.use('/api/courses',courses);
ClassMateApp.use('/api/users',users);

var request = require('supertest')(ClassMateApp);
var expect = require('chai').expect;
var should = require('chai').should();

describe('Testing courses route', function(){
	it('should return an course array in json', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			if(err) { return done(err); }
			expect(res.body).to.be.json;
			expect(res.body).to.be.array;
			(res.body).should.have.property('courses');
	    	done();
		});
	});
	it('should return a course', function(done){
		request.get('/api/courses/').expect(200).end(function(err,res) {
			request.get('/api/courses/' + res.body.courses[0]._id).expect(200).end(function(error,result) {
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
				console.log('/api/courses/' + res.body.courses[0]._id + '/classes/' + result.body.classes[0]._id);
				request.get('/api/courses/' + res.body.courses[0]._id + '/classes/' + result.body.classes[0]._id).expect(200).end(function(error,response) {
					if (error) { return done(error); }
					expect(response.body).to.be.json;
					expect(response.body).to.be.array;
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
	});

	it('should add a new course', function(done){
		var themessage = 'creator=5519556233e3c074147481ba&name=Mobile+Development+1&description=Building+hybrid+apps';
		request.post('/api/courses/').type('application/x-www-form-urlencoded').send(themessage).expect(201).end(function(err, res){
			(res.body).should.have.property('message','Course Added');
			done();
		});		
	});
});

describe('Testing users route', function(){
	it('should return users', function(done){
		request.get('/api/users/').expect(200).end(function(err,res) {
			if (err) { return done(err); }
			expect(res.body).to.be.json;
			(res.body).should.have.property('users');
			done();
		});
	});
});

