var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET home page.
router.get('/', function(req, res, next) {
	console.log(req.user);
  res.render('index', { title: 'Express', message: "req.flash('signupMessage')", user: req.user });
});

module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}