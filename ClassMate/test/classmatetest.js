var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var classes = require('../routes/classes');
var attendances = require('../routes/attendances');
var messages = require('../routes/messages');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/classmate');
app.use('/messages', messages);
app.use('/attendances', attendances);
app.use('/classes', classes);



describe('Testing classmate route', function(){
	var url = 'http://localhost:3000/';
	describe('normal messages', function(){
		it('should return 3 messages', function(done){
			request(url).get('/messages').end(function(err,res){
				if (err) { throw err; }
				res.should.be.json;
				res.status.should.have.equal(200);
				done();
			});
		});
	});
});

