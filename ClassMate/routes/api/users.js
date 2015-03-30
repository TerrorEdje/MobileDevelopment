var express = require('express');
var router = express.Router();

/* GET user  by id */
router.route('/:id/').get(function(req, res) {
	Course.find(function(err, courses) {
  	if (err) {
    		return res.send(err);
  	}
		res.json(courses);
	});
});

module.exports = router;
