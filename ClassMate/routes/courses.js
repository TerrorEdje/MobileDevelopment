var express = require('express');
var router = express.Router();
var Course = require('../model/courses');

/* GET course list */
router.route('/').get(function(req, res) {
	Course.find(function(err, courses) {
  	if (err) {
    		return res.send(err);
  	}
		res.json(courses);
	});
});

/* GET course by id */
router.route('/:id').get(function(req, res) {
	Course.findOne({ _id: req.params.id}, function(err, course) {
  	if (err) {
    		return res.send(err);
  	} 
  	res.json(course);
	});
});

/* POST course */
router.route('/').post(function(req, res) {
	var course = new Course(req.body);
	course.save(function(err) {
  	if (err) {
    		return res.send(err);
  	} 
  	res.send({ message: 'Course Added' });
	});
});

/* DELETE course by id */
router.route('/:id').delete(function(req, res) {
  Course.findOne({ _id: req.params.id }).remove().exec();
  res.send({ message: 'Course Deleted'});
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
