var express = require('express');
var Attendance = require('../model/attendances');
var router = express.Router();

/* GET attendances list */
router.route('/').get(function(req, res) {
  	Attendance.find(function(err, attendances) {
    	if (err) {
      		return res.send(err);
    	}
 		res.json(attendances);
  	});
});

/* GET attendances by id */
router.route('/:id').get(function(req, res) {
  	Attendance.findOne({ _id: req.params.id}, function(err, attendance) {
    	if (err) {
      		return res.send(err);
    	} 
    	res.json(attendance);
  	});
});

/* DELETE attendances by id */
router.route('/:id').delete(function(req, res) {
  Attendance.findOne({ _id: req.params.id }).remove().exec();
  res.send({ message: 'Attendance Deleted'});
});

/* POST attendance */
router.route('/').post(function(req, res) {
  	var attendance = new Attendance(req.body);
  	attendance.save(function(err) {
    	if (err) {
      		return res.send(err);
    	} 
    	res.send({ message : 'Attendance Added' });
  	});
});

module.exports = router;
