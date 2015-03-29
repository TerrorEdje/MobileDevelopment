var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET user list */
router.route('/').get(function(req, res) {
  User.find({}, function(err, data){
    if (err) {
      return res.send(err);
    }
    res.json({ users: data});
    res.status(200);
  });
});

/* GET user by id */
router.route('/:id').get(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, data){
    if (err) {
      	return res.send(err);
    }
    res.json(data);
    res.status(200);
  });
});

/* PUT user by id */ 
router.route('/:id/').put(function(req, res) {
  	User.findOne({ _id: req.params.id }, function(err, user) {
	    if (err) {
	        return res.send(err);
	    } 
	    user.save(req.body,function(err) {
	      	if (err) {
	        	return res.send(err);
	      	}
	      	res.status(200);
	      	res.send({ message: 'User updated' });
	    });
  	});
});

/* POST user */
router.route('/').post(function(req, res) {
  	var user = new User(req.body);
  	user.save(function(err) {
  		if (err)
  		{
  			return res.send(err);
  		}
  		res.send({ message: 'User Added' });
        res.status(201);
  	})
});

/* DELETE course by id */
router.route('/:id/').delete(function(req, res) {
	User.remove(req.params.id, function(err) {
		if (err) {
			return res.send(err);
		};
		res.status(200);
		res.send({ message: 'User deleted'});
	});
});

module.exports = router;
