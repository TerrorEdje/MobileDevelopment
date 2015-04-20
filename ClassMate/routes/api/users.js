var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Course = require('../../models/course');

/* GET user list 
	QUERY
	page: 0 or higher (default no pages)
	courses: true or false (default false)
*/
router.route('/').get(function(req, res) {
	var page = {};
	var selection = { courses:0 };
	if (req.query.courses === 'true') {
		delete selection.courses;
	}
	if (req.query.page)
	{
		if (isNaN(req.query.page)) {
			res.status(400);
			return res.json('Page has to be a number');
		}
		page = { skip: 10 * req.query.page, limit: 10};
	}
 	User.find({},selection,page, function(err, data){
 		if (err) { res.status(404); return res.json(err) };
		if (data.length == 0) {
			res.status(404);
			return res.json('Not found');
		}
    	res.status(200);
    	return res.json({ users: data});
  	});
});

/* GET user by id or subId
	QUERY
	type: id or subId (default id)
	courses: true or false (default false)
*/
router.route('/:id').get(function(req, res) {
	var selection = { courses:0 };
	if (req.query.courses === 'true') {
		delete selection.courses;
	}
	var search = { _id: req.params.id };
	if (req.query.type === 'subId')	{
		search = { subId: req.params.id };
	}
	User.findOne(search,selection, function(err, data){
		if (err) { res.status(404); return res.json(err); }
		if (!data) {
			res.status(404);
			return res.json('Not found'); 
		}
		res.status(200);
		return res.json(data);
  	});
});

/* PUT user by id */
router.route('/:id/').put(function(req, res) {
  	User.findOne({ _id: req.params.id }, function(err, user) {
  		if(err) { 
			res.status(404);
			return res.json(err); 
		}
		if (!user) {
			res.status(404);
			return res.json('Not found');
		}
    	user.save(req.body,function(err) {
    		if(err) { 
				res.status(400);
				return res.json(err); 
			}
		    res.status(200);
		    return res.json('User updated');
		});
  	});
});

/* POST user */
router.route('/').post(function(req, res) {
  	var user = new User(req.body);
  	user.save(function(err) {
  		if(err) { 
			res.status(400);
			return res.json(err); 
		}  		
        res.status(201);
        return res.json('User added');
  	});
});

/* 	POST course to user */
router.route('/:id/courses/').post(function(req, res) {
  	Course.findOne({ subId: req.body.id}, function(err,course) {
    	if (!course) {
      		res.status(404);
      		return res.json('Course not found.');
    	}
    	if(err) { 
			res.status(404);
			return res.json(err); 
		}
		User.findOne({ _id: req.params.id }, function(err, user) {
			if (!user) {
	      		res.status(404);
	      		return res.json('User not found.');
	    	}
	    	if(err) { 
				res.status(404);
				return res.json(err); 
			}
			if (user.courses.indexOf(course._id) < 0) {	user.courses.push(course._id); }
			else { res.status(400);	return res.json('User already subscribed to course.'); }
			if (course.participants.indexOf(user._id) < 0) { course.participants.push(user._id); }
			else { res.status(400);	return res.json('Course already contains user'); }
			user.save(function(err) {
				if (err) {
					res.status(400);
					return res.json(err);
				}
			});
			course.save(function(err) {
				if (err) {
					res.status(400);
					return res.json(err);
				}
			});
			res.status(201);
			return res.json('User subscribed to course.');
		});
	});	
});

/* DELETE user by id */
router.route('/:id/').delete(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, user) {	
		if (err) {
			res.status(404);
			return res.json(err);
		}
		if (!user) {
			res.status(404); 
			return res.json('Not found');
		}
		user.remove()
		res.status(200);
		return res.json('User deleted');
	});
});
module.exports = router;
