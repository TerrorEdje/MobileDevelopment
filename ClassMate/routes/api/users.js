var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var qr = require('qr-image');
var Course = require('../../models/course');

/* GET user list */
router.route('/').get(function(req, res) {
 	User.find({}, function(err, data){
    	res.json({ users: data});
    	res.status(200);
  	});
});

/* GET user by id */
router.route('/:id').get(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, data){
    res.json(data);
    res.status(200);
  });
});

/* GET user by subid */
router.route('/subid/:subid').get(function(req, res) {
  User.findOne({ subId: req.params.subid }, function(err, data){
    res.json(data);
    res.status(200);
  });
});

/* PUT user by id */
router.route('/:id/').put(function(req, res) {
  	console.log(req.body);
  	User.findOne({ _id: req.params.id }, function(err, user) {
  		console.log(user);
    	user.save(req.body,function(err) {
		    res.status(200);
		    res.send({ message: 'User updated' });
		});
  	});
});

/* POST user */
router.route('/').post(function(req, res) {
  	var user = new User(req.body);
  	user.save(function(err) {
  		res.send({ message: 'User added' });
        res.status(201);
  	});
});

/* POST course to user */
router.route('/:id/courses/').post(function(req, res) {
  var courseId;
  Course.findOne({ subId: req.body.id}, function(err,course) {
    console.log(course);
    if (course == null) {
      res.status(200);
      return res.send({message: "No Course found with that key"});
    }
    if (err) {
      return res.send(err);
    }
    courseId = course._id;
    course.participants.push(req.params.id);
    course.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.status(200);
    });
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) {
        return res.send(err);
      }
      user.courses.push(courseId);
      user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.status(200);
        res.send({ message: 'User subscribed'});
      });
    });
  });
});

/* DELETE user by id */
router.route('/:id/').delete(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, user) {	
    	user.remove()
    	res.status(200);
    	res.send({ message: 'User deleted'});
  	});
});

module.exports = router;
