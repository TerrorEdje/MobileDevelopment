var express = require('express');
var router = express.Router();
var Class = require('../model/classes');

/* GET class list */
router.route('/').get(function(req, res) {
  	Class.find(function(err, classes) {
    	if (err) {
      		return res.send(err);
    	}
 		res.json(classes);
  	});
});

/* GET class by id */
router.route('/:id').get(function(req, res) {
  	Class.findOne({ _id: req.params.id}, function(err, classe) {
    	if (err) {
      		return res.send(err);
    	} 
    	res.json(classe);
  	});
});

/* POST class */
router.route('/').post(function(req, res) {
  	var classe = new Class(req.body);
  	classe.save(function(err) {
    	if (err) {
      		return res.send(err);
    	} 
    	res.send({ message: 'Class Added' });
  	});
});

/* DELETE class by id */
router.route('/:id').delete(function(req, res) {
  Class.findOne({ _id: req.params.id }).remove().exec();
  res.send({ message: 'Class Deleted'});
});

/* GET message list by class id */
router.route('/:id/messages').get(function(req, res) {
  	Class.findOne({ _id: req.params.id}, function(err, classe) {
    	if (err) {
      		return res.send(err);
    	} 
    	Message.find({ classId: classe._id },function(err, messages) {
    		if (err) {
      			return res.send(err);
    		}
 			res.json(messages);
  		});
  	});
});

/* GET attendance list by class id */
router.route('/:id/attendances').get(function(req, res) {
  	Class.findOne({ _id: req.params.id}, function(err, classe) {
    	if (err) {
      		return res.send(err);
    	} 
    	Attendance.find({ classId: classe._id },function(err, attendances) {
    		if (err) {
      			return res.send(err);
    		}
 			res.json(attendances);
  		});
  	});
});

module.exports = router;
