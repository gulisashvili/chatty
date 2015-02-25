var express = require('express');
var router = express.Router();
var User = require('../../models/user');



router.get('/all', function(req, res) {
  
  User.getAllUsers(function(err, users) {
    if(err) {
      res.send(404, {message: 'Not Found Any User'});      
    } else {
      res.json(users);
    }

  });
});


router.get('/:username', function(req, res) {
  User.getUserByUserName(req.params.username, function(err, users) {
    if(err) {
      res.send(404, {message: 'Not Found Any User'});      
    } else {
      res.json(users);
    }

  })
});


router.get('/:userId/get/contacts', function(req, res) {
  console.log(req.params.userId);
  if(req.params) {
    User.getUserContacts(req.params.userId, function(err, contacts) {
      if(err) {
        res.sendStatus(400);
      } else {
        res.json(contacts);
      }
    });
  }
});


router.post('/add/contact', function(req, res) {
  var options = {
    id: req.body.id,
    newContactId: req.body.newContactId
  };
  
  if(options.id == options.newContactId ) { return res.send(409, { message: "You can't add yourself"}); }
  
  User.addContact(options, function(err, result) {
    if(err) {
      res.sendStatus(400);
    } else {
      res.send(200, {message: 'success'});
    }
  });  
  

});

router.post('/remove/contact', function(req, res) {
  var options = {
    id: req.body.id,
    contactId: req.body.contactId
  };

  User.removeContact(options, function(err, result) {
    if(err) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });

});






module.exports = router;
