var express = require('express');
var router = express.Router();
var Course = require('../../models/course');
var qr = require('qr-image');


/* GET course list */
router.route('/').get(function(req, res) {
  Course.find({}, {creator:1, name:1, description:1, subId:1}, function(err, data){
    if (err) { return res.send(err) };
    res.json({ courses: data});
    res.status(200);
  });
});

/* GET course by subid */
router.route('/subid/:subId').get(function(req, res) {
  Course.findOne({ subId: req.params.subId },{creator:1, name:1, description:1, subId:1}, function(err, data){
    if (err) { return res.send(err) };
    res.json(data);
    res.status(200);
  });
});

/* GET qr image by course id */
router.get('/:id/qr', function(req, res) {
  var code = qr.image(req.params.subId.toString(), { type: 'png' });
    res.type('png');
    code.pipe(res);
});

/* GET FULL course list */
router.route('/full').get(function(req, res) {
  Course.find({}, function(err, data){
    res.json({ courses: data});
    res.status(200);
  });
});

/* GET FULL course list */
router.route('/full/:page').get(function(req, res) {
  var skipp = 10 * req.params.page;
  Course.find({},{},{ skip: skipp, limit: 10}, function(err, data){
    if (err) { return res.send(err) };
    res.json({ courses: data});
    res.status(200);
  });
});

/* GET course by id */
router.route('/:id').get(function(req, res) {
  Course.findOne({ _id: req.params.id },{creator:1, name:1, description:1, subId:1}, function(err, data){
    if (err) { return res.send(err) };
    res.json(data);
    res.status(200);
  });
});

/* GET FULL course list */
router.route('/:id/full').get(function(req, res) {
  Course.findOne({ _id: req.params.id }, function(err, data){
    if (err) { return res.send(err) };
    res.json(data);
    res.status(200);
  });
});


/* GET classes by course id */
router.route('/:id/classes').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      res.json({ classes: data.classes });
      res.status(200);
    });
});

/* GET class by course and class id */
router.route('/:id/classes/:cid').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup = data.classes[i];
      }
      res.json(lookup);
      res.status(200);
    });
});

/* GET participants by course id */
router.route('/:id/participants').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      res.json({ participants: data.participants });
      res.status(200);
    });
});

/* GET messages by course and class id */
router.route('/:id/classes/:cid/messages').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      res.json({ messages: lookup[req.params.cid].messages });
      res.status(200);
    });
});

/* GET attendances by course and class id */
router.route('/:id/classes/:cid/attendances').get(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      res.json({ attendances: lookup[req.params.cid].attendances });
      res.status(200);
    });
});

/* POST message by course and class id */
router.route('/:id/classes/:cid/messages').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      lookup[req.params.cid].messages.push(req.body);
      data.save(function(err, savedCourse){
        if(err){ return handleError(req, res, 500, err); }
        else {
            res.status(201);
            res.send({ message: 'Message added' });
        }
      });
    });
});

/* POST participant by course id */
router.route('/:id/participants').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      	data.participants.push(req.body);
      	data.save(function(err, savedCourse){
        if(err){ return res.send(err); }
        else {
            res.status(201);
            res.send({ message: 'Participant added' });
        }
      });
    });
});

/* POST class by course id */
router.route('/:id/classes').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      data.classes.push(req.body);
      data.save(function(err, savedCourse){
        if(err){ return res.send(err); }
        else {
            res.status(201);
            res.send({ message: 'Class added' });
        }
      });
    });
});

/* POST attendance by course and class id */
router.route('/:id/classes/:cid/attendances').post(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      if (err) { return res.send(err) };
      var lookup = {};
      for (var i = 0, len = data.classes.length; i < len; i++) {
          lookup[data.classes[i]._id] = data.classes[i];
      }
      lookup[req.params.cid].attendances.push(req.body);
      data.save(function(err){
        if(err){ return res.send(err); }
        else {
            res.status(201);
            res.send({ message: 'Attendance added' });
        }
      });
    });
});

/* PUT course by id */
router.route('/:id/').put(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, course) {
      if (err) { return res.send(err) };
      course.update(req.body,function(err) {
        if (err) { return res.send(err) };
          res.status(200);
          res.send({ message: 'Course updated' });
      });
    });
});

/* POST course */
router.route('/').post(function(req, res) {
    var course = new Course(req.body);
    course.save(function(err) {
      if (err) { return res.send(err) };
      res.send({ message: 'Course added' });
        res.status(201);
    })
});


/* DELETE course by id */
router.route('/:id/').delete(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, course) {	
    	course.remove()
    	res.status(200);
    	res.send({ message: 'Course deleted'});
  	});
});

/* DELETE class by course and class id */
router.route('/:id/classes/:cid').delete(function(req, res) {
    Course.findOne({ _id: req.params.id }, function(err, data){
      for (var i = 0, len = data.classes.length; i < len; i++) {
        if (data.classes[i]._id == req.params.cid) {
          data.classes.splice(i,1);
        }
      }
      data.save(function(err) {
        if (err) { return res.send(err); }
        res.send({ message: 'Class deleted'});
        res.status(200);
      });      
    });
});

module.exports = router;