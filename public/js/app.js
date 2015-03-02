angular.module('Chatty', ['ngRoute','ui.bootstrap'])
  .run(function($rootScope, User, Conversation,  socket) {

    $rootScope.hasInContacts = function(contactId) {
      return _.contains($rootScope.currentUser.contacts, contactId);
    };
    
    $rootScope.loadUser = function() {
      User.getCurrentUser(function(user) {
        $rootScope.data = {};
        $rootScope.currentUser = user;
        $rootScope.currentUserId = user._id;
        $rootScope.conversations = {};
        
        User.getUserContacts($rootScope.currentUserId, function(data) {
          $rootScope.userContacts = data;
          socket.emit('current:user', $rootScope.currentUserId, function(err, onlineUsers) {
            _.each($rootScope.userContacts, function(contact) {
              _.each(onlineUsers, function(userId) {
                if(contact && contact._id == userId) contact.isOnline = true;
              });
            });
          });
        });


        Conversation.getGroupConversationsByMember($rootScope.currentUserId, function(conversations) {
          $rootScope.groupConversations = conversations;
        });
      
      });
    };

  
  })

  .controller('MainCTRL', function($scope, $log, User, Conversation, socket, $timeout) {
    $scope.conversationsArr = [];



    $scope.loadConversation = function(userID, conversationId) {
      if(!userID && conversationId) {
        Conversation.getConversationById(conversationId, function(data) {
          $scope.conversations[data._id] = data;
          $scope.conversation = $scope.conversations[data._id];
          $scope.conversationId = data._id;
          $scope.data.to = $scope.conversation.members.filter(function(user) {
            return user._id != $scope.currentUserId;
          });
          $scope.loadChat = true;

        });
      } else {
          var data = [];  
          $scope.data.to = userID;    
          
          data.push($scope.currentUserId, userID);

          Conversation.getConversation(data, function(data) {

            $scope.conversations[data._id] = data;
            $scope.conversation = $scope.conversations[data._id];
            $scope.conversationId = data._id;
            $scope.conversationsArr.push(data._id);
            $scope.data.to = $scope.conversation.members.filter(function(user) {
              return user._id != $scope.currentUserId;
            });
            $scope.loadChat = true;

    	    }); 
      }	
    };

    $scope.sendNewMessage = function() {      
      if ($scope.data.newMessage) {
        $scope.data.newMessage.trim();
        var data = {
          currentUserId: $scope.currentUserId,
          conversationId: $scope.conversationId,
          newMessage: $scope.data.newMessage,
          to: $scope.data.to
        };
        socket.emit('send-new:message', data, function(error, result) {
          if(error) {
            alert("something went wrong");
          } else if(result) {
            var messageArray = result.messages;
            var message = messageArray[messageArray.length-1];
            message.username = $scope.currentUser.username;

            $scope.conversation.messages.push(message); 
            $scope.data.newMessage = '';

          }
        });
      } else {
        alert("please enter message ");
      }

    };

    $scope.playMessage = function () {
      var audio = document.getElementById("new-message-sound");
      audio.load();
      audio.play();
    };

    socket.on('new:message', function(result) {
      var messageArray = result.messages;
      _.filter(result.members, function(member) {
        return member._id != $scope.currentUserId;
      });
      var userToSend = result.members;
      var message = messageArray[messageArray.length-1];
      $scope.playMessage();
      _.each($scope.userContacts, function(user) {
        if( user.username == message.author.username && $scope.data.to != message.author._id && result.members.length < 3)
          user.newMessage = true;
      });
      _.each($scope.groupConversations, function(conversation) {
        if(conversation._id == result._id && result.members.length > 2) {
          conversation.newMessage = true;
        }
      });

      if($scope.conversationId == result._id) {
        $scope.conversation.messages.push(message);
      }
    });
 
    User.getAllUsers(function(data) {
      $scope.users = data; 
    });


    socket.on('is:online', function(userId) {
      
      _.each($scope.userContacts, function(contact) {
        if(contact._id == userId) contact.isOnline = true;
      });
    
    });

    socket.on('is:offline', function(userId) {
      
      _.each($scope.userContacts, function(contact) {
        if(contact._id == userId) contact.isOnline = false;
      });
          
    });


  });
