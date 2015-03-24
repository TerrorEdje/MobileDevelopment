var express = require('express');
var Message = require('../model/messages');
var router = express.Router();

/* GET message list */
router.route('/').get(function(req, res) {
  	Message.find(function(err, messages) {
    	if (err) {
      		return res.send(err);
    	}
 		res.json(messages);
  	});
});

/* GET message by id */
router.route('/:id').get(function(req, res) {
  	Message.findOne({ _id: req.params.id}, function(err, message) {
    	if (err) {
      		return res.send(err);
    	} 
    	res.json(message);
  	});
});

/* DELETE message by id */
router.route('/:id').delete(function(req, res) {
  Message.findOne({ _id: req.params.id }).remove().exec();
  res.send({ message: 'Message Deleted'});
});

/* UPDATE message by id */
router.route('/:id').put(function(req, res) {
  Message.findOne({ _id: req.params.id}, function(err, message) {
    if (err) {
        return res.send(err);
    } 
    message.classId = req.body.classId;
    message.userId = req.body.userId;
    message.userFullName = req.body.userFullName;
    message.message = req.body.message;
    message.time = req.body.time;
    message.save(function(err) {
      if (err) {
        return res.send(err);
      }
    });
    res.send({ message: 'Message Updated' });
  });
});

/* POST message */
router.route('/').post(function(req, res) {
  	var message = new Message(req.body);
  	message.save(function(err) {
    	if (err) {
      		return res.send(err);
    	} 
    	res.send({ message: 'Message Added' });
  	});
});

module.exports = router;
