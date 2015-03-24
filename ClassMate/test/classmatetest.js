var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/classmate');

describe('Testing classmate route', function(){
	var url = 'http://localhost:3000';
	describe('courses', function(){
		it('should return courses', function(done){
			request(url).get('/api/courses').end(function(err,res){
				if (err) { throw err; }
				res.should.be.json;
				res.status.should.have.equal(200);
				done();
			});
		});
	});
});

