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

module.exports = router;
