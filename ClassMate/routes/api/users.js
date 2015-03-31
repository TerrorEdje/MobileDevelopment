var express = require('express');
var router = express.Router();
var User = require('../../models/user');

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
    User.findOne({ _id: req.params.id }, function(err, user) {
      user.courses.push(req.body);
      user.save(req.body,function(err) {
          if (err) {
            return res.send(err);
          }
          res.status(200);
          res.send({ message: 'Course added to User' });
      });
    });
});

/* DELETE user by id */
router.route('/:id/').delete(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, user) {	
    	user.remove()
    	res.status(200);
    	res.send({ message: 'Course deleted'});
  	});
});

module.exports = router;
