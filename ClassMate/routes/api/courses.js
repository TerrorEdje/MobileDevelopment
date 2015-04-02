var express = require('express');
var router = express.Router();
var Course = require('../../models/course');

/* 	GET course list 
	QUERY 
	full: true or false (default false)
	page: 0 or higher (default no pages)
*/
router.route('/').get(function(req, res) {
	var page = {};
	var selection = {creator:1, name:1, description:1, subId:1};
	var search = { _id: req.params.id };
	if (req.query.classes === 'true') {
		selection["classes"] = 1;
	}
	if (req.query.participants === 'true') {
		selection["participants"] = 1;
	}
	if (req.query.page)
	{
		page = { skip: 10 * req.query.page, limit: 10};
	}
	Course.find({}, selection, page, function(err, data){
    	if (err) { return res.send(err) };
    	if (data.length == 0)
    	{
      		res.status(404);
      		return res.send('Not found');
    	}
		res.json({ courses: data});
		return res.status(200); 
  	});	 	
});

/* 	GET course by id or subId
	QUERY 
	classes: true or false (default false)
	participants: true or false (default false)
	type: id or subId (default id)
*/
router.route('/:id').get(function(req, res) {
	var selection = {creator:1, name:1, description:1, subId:1};
	var search = { _id: req.params.id };
	if (req.query.classes === 'true') {
		selection["classes"] = 1;
	}
	if (req.query.participants === 'true') {
		selection["participants"] = 1;
	}
	if (req.query.type === 'subId')	{
		search = { subId: req.params.id };
	}
  	Course.findOne(search,selection, function(err, data){
    	if (data) { 
    		res.json(data);
    		return res.status(200);
    	}
    	else
    	{
      		res.status(404);
      		return res.send('Not found');
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
      		res.status(404);
      		return res.send('Not found'); 
      	}
      	else
      	{
  			for (var i = 0, len = data.classes.length; i < len; i++) {
  				if (!messages) { data.classes[i].messages = undefined; }
		        if (!attendances) { data.classes[i].attendances = undefined; }
		    }      		
      		res.json({ classes: data.classes });
      		return res.status(200);
      	}      
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
      		return res.send('Not found'); 
      	}
      	else
      	{
      		var classe = data.classes.id(req.params.cid);
      		if (!messages) { classe.messages = undefined; }
		    if (!attendances) { classe.attendances = undefined; }     		
		    res.json(classe);
      		return res.status(200);
      	}      
    });
});

/* POST message by course and class id */
router.route('/:id/classes/:cid/messages').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      lookup[req.params.cid].messages.push(req.body);
      data.save(function(err, savedCourse){
        if(err){ return handleError(req, res, 500, err); }
        else {
            res.status(201);
            res.send({ message: 'Message added' });
        }
      });
    });
});

/* POST participant by course id */
router.route('/:id/participants').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      	data.participants.push(req.body);
      	data.save(function(err, savedCourse){
        if(err){ return res.send(err); }
        else {
            res.status(201);
            res.send({ message: 'Participant added' });
        }
      });
    });
});

/* POST class by course id */
router.route('/:id/classes').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      data.classes.push(req.body);
      data.save(function(err, savedCourse){
        if(err){ return res.send(err); }
        else {
            res.status(201);
            res.send({ message: 'Class added' });
        }
      });
    });
});

/* POST attendance by course and class id */
router.route('/:id/classes/:cid/attendances').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      lookup[req.params.cid].attendances.push(req.body);
      data.save(function(err){
        if(err){ return res.send(err); }
        else {
            res.status(201);
            res.send({ message: 'Attendance added' });
        }
      });
    });
});

/* PUT course by id */
router.route('/:id/').put(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, course) {
      if (err) { return res.send(err) };
      course.update(req.body,function(err) {
        if (err) { return res.send(err) };
          res.status(200);
          res.send({ message: 'Course updated' });
      });
    });
});

/* POST course */
router.route('/').post(function(req, res) {
    var course = new Course(req.body);
    course.save(function(err) {
      if (err) { return res.send(err) };
      res.send({ message: 'Course added' });
        res.status(201);
    })
});


/* DELETE course by id */
router.route('/:id/').delete(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, course) {	
    	course.remove()
    	res.status(200);
    	res.send({ message: 'Course deleted'});
  	});
});

/* DELETE class by course and class id */
router.route('/:id/classes/:cid').delete(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      for (var i = 0, len = data.classes.length; i < len; i++) {
        if (data.classes[i]._id == req.params.cid) {
          data.classes.splice(i,1);
        }
      }
      data.save(function(err) {
        if (err) { return res.send(err); }
        res.send({ message: 'Class deleted'});
        res.status(200);
      });      
    });
});

module.exports = router;