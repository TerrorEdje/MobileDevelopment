var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET home page.
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { page: 'home', title: 'Home', user: req.user });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/courses', isLoggedIn, function(req, res, next) {
  res.render('courses', { page: 'courses', title: 'Courses', user: req.user });
});

module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}