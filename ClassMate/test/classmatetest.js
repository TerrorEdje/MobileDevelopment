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

describe('Testing classmate route', function(){
	it('should return courses', function(done){
		makeRequest('/api/courses/',200,function(err,res) {
			if (err) { return done(err); }
			expect(res.body).to.be.json;
			done();
		});
	});
});

