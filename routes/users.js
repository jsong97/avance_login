const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User model (from the models folder)
let User = require('../models/user');

// Register form
router.get('/register', function(req, res){
  // render a view called register
  res.render('register');
});

// Register Process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;


  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors){
    res.render('register', {
      errors: errors
    });
  } else {
    // we can do this because we brought in the model above
    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    // this will hash the password
    bcrypt.genSalt(10, function(err, salt){
      // call in hash, pass in the salt, get the hash back
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          console.log(err);
        }
        // set the password to the hash
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          }
          req.flash('success', 'You are now registered!');
          res.redirect('/users/login')
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Logout successful');
  res.redirect('/users/login');
});

module.exports = router;
