var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET logout	
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
// LOGIN ===============================

// send to google to do the authentication
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/google/callback',
	passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/'
	}));

module.exports = router;