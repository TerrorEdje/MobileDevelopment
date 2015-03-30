var express = require('express');
var router = express.Router();
var Course = require('../../models/course');

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

/* GET messages by class and message id */
router.route('/:id/classes').get(function(req, res) {
  Course.findOne({ _id: req.params.id },{ classes:1, _id:0}, function(err, data){
    if (err) {
      return res.send(err);
    }
    res.json(data);
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
