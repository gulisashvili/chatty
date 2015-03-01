var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Conversation = require('../../models/conversation');
var _ = require('underscore');

// get conversation by members
router.post('/', function(req, res) {
  var members = req.body;

  Conversation.getConversationByMembers(members, function(err, conversation) {
    if(!conversation) {
      Conversation.createNew(members, function(err, conversation) {
        res.json(conversation);
      });
    } else if(conversation) {
      res.json(conversation);
    }
  });

});

// get convesrations by member
router.get('/by/:member', function(req, res) {
  if(req.params.member) {
    var currentMember = req.params.member;

    Conversation.getConversationsByMember(currentMember, function(err, conversations) {
      if(err) {
        res.sendStatus(400);
      } else if(conversations) {
          _.each(conversations, function(conversation) {
           _.each(conversation.members, function(member, index) {
             if(member && member['_id'] == currentMember) {
               conversation.members.splice(index, 1)
             }
           });
          });
      res.json(conversations);
      }
    });   
  } else {
    res.send(403);
  }

});

router.post('/create/new/conversation', function(req, res) {
  var membersArr = req.body.members;
  if(membersArr.length > 2) {
    Conversation.createNew(membersArr, function(err, conversation) {
      if(err) {
        res.sendStatus(400);
      } else if(conversation) {
        res.json(conversation);
      }
    });
  } else {
    res.send(403, {error: "At least 3 members are required"});
  }
});



router.get('/by/group/:member', function(req, res){
  if(req.params) {
    var member = req.params.member;
    Conversation.getGroupConversationsByMember(req.params.member, function(err, conversations) {
      if(err) {
        res.sendStatus(409);
      } else if(conversations) {
        res.json(conversations);
      }
    });
  } else {
    res.sendStatus(400);
  }
}); 


router.get('/:conversationId', function(req, res) {
  if(req.params.conversationId) {
    var id = req.params.conversationId;
    Conversation.getConversation(id, function(err, conversation) {
      if(err) {
        res.sendStatus(409);
      } else if(conversation) {
        res.json(conversation);
      }
    });
  } else {
    res.sendStatus(400);
  }
});








router.post('/add/new/message', function(req, res) {
  if(req.body) {
    var data = {
      id: req.body.conversationId,
      currentUserId: req.body.currentUserId,
      newMessage: req.body.newMessage
    };

    Conversation.addNewMessage(data, function(err, conversation) {
      if(err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(403);
  }
});


module.exports = router;

