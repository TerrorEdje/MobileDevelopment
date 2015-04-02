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
	if (req.query.page)
	{
		page = { skip: 10 * req.query.page, limit: 10};
	}
	if (req.query.full) {
		if (req.query.full == 'true')
		{
			selection = {};
		}
	}
	Course.find({}, selection, page, function(err, data){
    	if (err) { return res.send(err) };
    	if (data.length == 0)
    	{
    		res.status(404);
    	 	return res.send({ message: 'Nothing found.'});
    	}
		res.json({ courses: data});
		return res.status(200); 
  	});	 	
});

/* 	GET course by id or subId
	QUERY 
	full: true or false (default false)
	type: id or subId (default id)
*/
router.route('/:id').get(function(req, res) {
	var selection = {creator:1, name:1, description:1, subId:1};
	var search = { _id: req.params.id };
	if (req.query.full) {
		if (req.query.full == 'true')
		{
			selection = {};
		}
	}
	if (req.query.type)
	{
		if (req.query.type == 'subId')
		{
			search = { subId: req.params.id };
		}
	}
  	Course.findOne(search,selection, function(err, data){
    	if (data) { 
    		res.json(data);
    		return res.status(200);
    	}
    	else
    	{
    		res.send({ message: 'Could not find anything' });
    		return res.status(404);
    	} 	
  	});
});

/* GET classes by course id */
router.route('/:id/classes').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      res.json({ classes: data.classes });
      res.status(200);
    });
});

/* GET class by course and class id */
router.route('/:id/classes/:cid').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup = data.classes[i];
      }
      res.json(lookup);
      res.status(200);
    });
});

/* GET participants by course id */
router.route('/:id/participants').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      res.json({ participants: data.participants });
      res.status(200);
    });
});

/* GET messages by course and class id */
router.route('/:id/classes/:cid/messages').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      res.json({ messages: lookup[req.params.cid].messages });
      res.status(200);
    });
});

/* GET attendances by course and class id */
router.route('/:id/classes/:cid/attendances').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      res.json({ attendances: lookup[req.params.cid].attendances });
      res.status(200);
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