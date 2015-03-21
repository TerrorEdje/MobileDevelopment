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
