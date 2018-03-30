const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match usernames
    let query = {username:username};
    // we only want to find one user
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }

      // since user is found, match Passwords
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if (isMatch){
          // users matched
          return done(null, user, {message: 'Logged in'});
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  // just something required
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
