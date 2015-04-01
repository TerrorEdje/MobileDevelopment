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

/* GET qr image by user id */
router.get('/:id/qr', function(req, res) {
  var code = qr.image(req.params.subId.toString(), { type: 'png' });
    res.type('png');
    code.pipe(res);
});

/* GET user by id */
router.route('/:id').get(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, data){
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
  console.log(req.params.id);
  console.log(req.body);
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) {
        return res.send(err);
      }
      user.courses.push(req.body._id);
      user.save(function(err) {
          if (err) {
            return res.send(err);
          }
          Course.findOne({ _id: req.body._id}, function(err,course) {
            course.participants.push(req.params.id);
            course.save(function(err) {
              if (err) {
                return res.send(err);
              }
              res.status(200);
              res.send({ message: 'Course added to User and User added to Course.' });
            });
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
