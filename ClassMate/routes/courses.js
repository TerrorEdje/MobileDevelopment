var express = require('express');
var router = express.Router();
var Course = require('../models/course');

/* GET course list */
router.route('/').get(function(req, res) {
  Course.find({}, {creator:1, name:1, description:1}, function(err, data){
    if (err) {
      return res.send(err);
    }
    res.json(data);
  });
});

/* GET course by id */
router.route('/:id').get(function(req, res) {
	Course.findOne({ _id: req.params.id },{creator:1, name:1, description:1}, function(err, data){
    if (err) {
      	return res.send(err);
    }
    res.json(data);
  });
});

/* GET classes by course id */
router.route('/:id/classes').get(function(req, res) {
  	Course.findOne({ _id: req.params.id }, function(err, data){
    	if (err) {
      	return res.send(err);
    	}
    	res.json({ classes: data.classes });
  	});
});

/* GET participants by course id */
router.route('/:id/participants').get(function(req, res) {
  	Course.findOne({ _id: req.params.id }, function(err, data){
    	if (err) {
      	return res.send(err);
    	}
    	res.json({ classes: data.participants });
  	});
});

/* GET messages by class and course id */
router.route('/:id/classes/:cid/messages').get(function(req, res) {
  	Course.findOne({ _id: req.params.id }, function(err, data){
    	if (err) {
      	return res.send(err);
    	}
    	var lookup = {};
    	for (var i = 0, len = data.classes.length; i < len; i++) {
      		lookup[data.classes[i]._id] = data.classes[i];
    	}
   	 	res.json( lookup[req.params.cid].messages );
  	});
});

/* GET attendances by class and course id */
router.route('/:id/classes/:cid/attendances').get(function(req, res) {
  	Course.findOne({ _id: req.params.id }, function(err, data){
    	if (err) {
      	return res.send(err);
    	}
    	var lookup = {};
    	for (var i = 0, len = data.classes.length; i < len; i++) {
      		lookup[data.classes[i]._id] = data.classes[i];
    	}
   	 	res.json( lookup[req.params.cid].attendances );
  	});
});

router.route('/:id/classes/:cid/attendances').get(function(req, res) {
  	Course.findOne({ _id: req.params.id }, function(err, data){
    	if (err) {
      	return res.send(err);
    	}
    	var lookup = {};
    	for (var i = 0, len = data.classes.length; i < len; i++) {
      		lookup[data.classes[i]._id] = data.classes[i];
    	}
   	 	res.json( lookup[req.params.cid].attendances );
  	});
});

/* UPDATE course by id */
router.route('/:id').put(function(req, res) {
  Course.findOne({ _id: req.params.id}, function(err, course) {
    if (err) {
        return res.send(err);
    } 
    course.userId = req.body.userId;
    course.userFullName = req.body.userFullName;
    course.name = req.body.name;
    course.courseId = req.body.courseId;
    course.description = req.body.description;
    course.save(function(err) {
      if (err) {
        return res.send(err);
      }
    });
    res.send({ message: 'Course Updated' });
  });
});


/* GET class list by course id */
router.route('/:id/classes').get(function(req, res) {
	Course.findOne({ _id: req.params.id}, function(err, course) {
  	if (err) {
    		return res.send(err);
  	} 
  	Class.find({ courseId: course._id },function(err, classes) {
  		if (err) {
    			return res.send(err);
  		}
			res.json(classes);
		});
	});
});

module.exports = router;
