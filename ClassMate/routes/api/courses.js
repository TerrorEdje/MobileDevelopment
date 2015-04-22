var express = require('express');
var router = express.Router();
var Course = require('../../models/course');

/* 	GET course list 
	QUERY 
	classes: true or false (default false)
	participants: true or false (default false)
	page: 0 or higher (default no pages)
*/
router.route('/').get(function(req, res) {
	var selection = { classes:0, participants:0 };
	if (req.query.classes === 'true') {
		delete selection.classes;
	}
	if (req.query.participants === 'true') {
		delete selection.participants;
	}
	var page = {};
	if (req.query.page)	{
		if (isNaN(req.query.page)) {
			res.status(400)
			return res.json('Page has to be a number');
		}
		page = { skip: 10 * req.query.page, limit: 10};
	}
	Course.find({}, selection, page, function(err, data){
		if (data.length == 0) {
			res.status(404);
			return res.json('Not found');
		}
		res.status(200); 
		return res.json({ courses: data});
	});	 	
});

/* 	GET course by id or subId
	QUERY 
	classes: true or false (default false)
	participants: true or false (default false)
	type: id or subId (default id)
*/
router.route('/:id').get(function(req, res) {
	var selection = { classes:0, participants:0 };
	if (req.query.classes === 'true') {
		delete selection.classes;
	}
	if (req.query.participants === 'true') {
		delete selection.participants;
	}
	var search = { _id: req.params.id };
	if (req.query.type === 'subId')	{
		search = { subId: req.params.id };
	}
	Course.findOne(search,selection, function(err, data){
		if(err) { 
			res.status(400);
			return res.json(err); 
		}
		if (data) { 
			res.status(200);
			return res.json(data);
		}
		else {
			res.status(404);
			return res.json('Not found');
		}
	});
});

/* 	GET classes by course id 
	QUERY
	messages: true or false (default false)
	attendances: true or false  (default false)
*/
router.route('/:id/classes').get(function(req, res) {
	var messages = (req.query.messages === 'true');
	var attendances = (req.query.attendances === 'true');
	Course.findOne({ _id: req.params.id },{ classes:1 }, function(err, data){
		if (err) { 
			res.status(400);
			return res.json(err); 
		}
		if (!data) {
			res.status(404);
			return res.json('Not found');
		}
		for (var i = 0, len = data.classes.length; i < len; i++) {
			if (!messages) { data.classes[i].messages = undefined; }
			if (!attendances) { data.classes[i].attendances = undefined; }
		}      		
		res.status(200); 
		return res.json({ classes: data.classes }); 
	});
});

/* 	GET class by course and class id 	
	QUERY
	messages: true or false (default false)
	attendances: true or false  (default false)
*/
router.route('/:id/classes/:cid').get(function(req, res) {
	var messages = (req.query.messages === 'true');
	var attendances = (req.query.attendances === 'true');
	Course.findOne({ _id: req.params.id },{ classes:1 }, function(err, data){
		if (err) { 
			res.status(404);
			return res.json(err);			
		}
		if (data) {
			var classe = data.classes.id(req.params.cid);
			if (!messages) { classe.messages = undefined; }
			if (!attendances) { classe.attendances = undefined; }     		
			res.status(200);
			return res.json(classe);
		}      
		else {
			res.status(404);
			return res.json('Not found');
		}
	});
});

/* POST message/attendance by course and class id 
	QUERY
	type: message or attendance (REQUIRED)
*/
router.route('/:id/classes/:cid').post(function(req, res) {
	if (!req.query.type)
	{
		res.status(400);
		return res.json('Missing type');
	}
	console.log(req.body);
	Course.findOne({ _id: req.params.id }, function(err, data){
		if (err) { 
			res.status(404);
			return res.json(err); 
		}
		if (!data) {
			res.status(404);
			return res.json('Not found');
		}
		if (req.query.type == 'message') {	data.classes.id(req.params.cid).messages.push(req.body); }
		else if (req.query.type == 'attendance') { data.classes.id(req.params.cid).attendances.push(req.body); }
		else { res.status(400);	return res.json('Wrong type'); }
		data.save(function(err, savedCourse){
			if(err) { 
				res.status(400);
				return res.json(err); 
			}
			else {
				res.status(201);
				if (req.query.type == 'message') { return res.json('Message added'); }
				if (req.query.type == 'attendance') { return res.json('Attendance added'); }
			}
		});
	});
});

/* POST class by course id */
router.route('/:id').post(function(req, res) {
	Course.findOne({ _id: req.params.id }, function(err, data){
		if (err) { 
			res.status(404);
			return res.json(err);
		}
		if (data) {
			data.classes.push(req.body);
			data.save(function(err){
				if(err) { 
					res.status(400);
					return res.json(err); 
				}
				else {
					res.status(201);
					return res.json('Class added'); 
				}
		  	});
		}
	});
});

/* PUT course by id */
router.route('/:id/').put(function(req, res) {
	Course.findOne({ _id: req.params.id }, function(err, course) {
		if (err) { return res.json(err); }
		if (!course) {
			res.status(404);
			return res.json('Not found');
		}
		course.update(req.body,function(err) {
			if (err) { 
				res.status(400); 
				return res.json(err); 
			}
			res.status(200);
			return res.json('Course updated');
		});
	});
});

/* POST course */
router.route('/').post(function(req, res) {
	var course = new Course(req.body);
	course.save(function(err) {
		if (err) {
			res.status(400);
			return res.json(err);
		}      	
		res.status(201);
		return res.json('Course added');
	});
});


/* DELETE course by id */
router.route('/:id/').delete(function(req, res) {
	Course.findOne({ _id: req.params.id }, function(err, course) {	
		if (err) {
			res.status(404);
			return res.json(err);
		}
		if (!course) {
			res.status(404); 
			return res.json('Not found');
		}
		course.remove();
		res.status(200);
		return res.json('Course deleted');
	});
});

/* DELETE class by course and class id */
router.route('/:id/classes/:cid').delete(function(req, res) {
	Course.findOne({ _id: req.params.id }, function(err, data){
	  	if (err) {
			res.status(404);
			return res.json(err);
		}
		if (!data) {
			res.status(404);
			return res.json('Not found');
		}
		data.classes.id(req.params.cid).remove();
	  	data.save(function(err) {
			if (err) {
				res.status(404);
				return res.json(err);
			}		
			res.status(200);
			return res.json('Class deleted');
	  	});      
	});
});

module.exports = router;