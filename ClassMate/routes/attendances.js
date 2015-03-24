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

/* UPDATE attendance by id */
router.route('/:id').put(function(req, res) {
  Attendance.findOne({ _id: req.params.id}, function(err, attendance) {
    if (err) {
        return res.send(err);
    } 
    attendance.status = req.body.status;
    attendance.classId = req.body.classId;
    attendance.userId = req.body.userId;
    attendance.userFullName = req.body.userFullName;
    attendance.reason = req.body.reason;
    attendance.time = req.body.time;
    attendance.arrivalTime = req.body.arrivalTime;
    attendance.location = req.body.location;
    attendance.save(function(err) {
      if (err) {
        return res.send(err);
      }
    });
    res.send({ message: 'Attendance Updated' });
  });
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