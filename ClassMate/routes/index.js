var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/userlist', function(req, res) {
	var mongoose = req.mongoose;
	var User = mongoose.model('User');
	User.find(function (err, users) {
  		if (err) return console.error(err);
  		console.log(users)
  		console.log(Date.now());
	})
});

module.exports = router;
