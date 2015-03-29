var ClassMateApp = require('../app.js');
var request = require('supertest')(ClassMateApp);
var expect = require('chai').expect;
var should = require('chai').should();

function makeRequest(route, statusCode, done){
	request
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing courses route', function(){
	it('should return an course array in json', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			if (err) { return done(err); }
			expect(res.body).to.be.json;
			expect(res.body).to.be.array;
			(res.body).should.have.property('courses');
	    	done();
		});
	});
	it('should return a course', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			makeRequest('/api/courses/' + res.body.courses[0]._id,200,function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				(result.body).should.have.property('name','Mobile Development 1');
				done();
			});
		});		
	});
	it('should return an array of classes', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			makeRequest('/api/courses/' + res.body.courses[0]._id + '/classes',200,function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.be.array;
				(result.body).should.have.property('classes');
				done();
			});
		});		
	});
	it('should return an array of participants', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			makeRequest('/api/courses/' + res.body.courses[0]._id + '/participants',200,function(error,result) {
				if (error) { return done(error); }
				expect(result.body).to.be.json;
				expect(result.body).to.be.array;
				(result.body).should.have.property('participants');
				done();
			});
		});		
	});
	it('should return an array of messages', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			makeRequest('/api/courses/' + res.body.courses[0]._id + '/classes/',200,function(error,result) {
				makeRequest('/api/courses/' + res.body.courses[0]._id + '/classes/' + result.body.classes[0]._id + '/messages/',200,function(err,data) {
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
		makeRequest('/api/courses/',200,function(err,res) {
			makeRequest('/api/courses/' + res.body.courses[0]._id + '/classes/',200,function(error,result) {
				makeRequest('/api/courses/' + res.body.courses[0]._id + '/classes/' + result.body.classes[0]._id + '/attendances/',200,function(err,data) {
					if (error) { return done(error); }
					expect(data.body).to.be.json;
					expect(data.body).to.be.array;
					(data.body).should.have.property('attendances');
					done();
				});
			});
		});		
	});
});

describe('Testing users route', function(){
	it('should return users', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			if (err) { return done(err); }
			expect(res.body).to.be.json;
			done();
		});
	});
});

