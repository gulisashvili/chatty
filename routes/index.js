var express = require('express');
var router = express.Router();
var User = require('../models/user');
var session = require('express-session');
var passport = require('passport');
var _ = require('underscore');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('../middlewares/auth');
var Conversation = require('../models/conversation');
var mailer = require('../helpers/mailer');

router.use(session({
  secret: "mastering node.js and angular.js",
  resave: true,
  maxAge: 3600000,
  saveUninitialized: false
}));

// passport configuration
router.use(passport.initialize());
router.use(passport.session());


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// view register page
router.get('/register', auth.checkAuth, function(req, res) {
  res.render('register');
});

// register user
router.post('/register', function(req, res) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save(function(err, user) {
    if(err) {
      res.json(err);
    } else {
      mailer.sendMail(user.email);
      console.log("Saved new User, ", user);
      res.redirect('/login');  
    }
    
  })
}); 

// User.getAllUsers(function(err, users) {
//   var conversation = new Conversation();
  
//   _.each(users, function(user) {
//     conversation.members.push(user._id);
//     conversation.messages.push({
//       author: user._id,
//       message: "Just Testing",
//       date: new Date()
//     });
//   });

//   conversation.save();

// });



router.get('/login', auth.checkAuth, function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login' 
})); 

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// home route
router.get('/', function(req, res) {
    if(!req.user) {
      res.redirect('/login');
    } else {
      req.user.password = null;
      res.render('index',{user: req.user});
    }
});

router.get('/current', function(req, res) {
  if(req.user) {
    req.user.password = null;
    res.json(req.user);
  } else {
    res.json({message: 'No Current User'});
  }
  
});


// router.get("*", function(req, res) {
//   res.redirect('/');
// });





module.exports = router;
