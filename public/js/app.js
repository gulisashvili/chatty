angular.module('Chatty', ['ngRoute','ui.bootstrap'])
  .run(function($rootScope, User, socket) {

    $rootScope.hasInContacts = function(contactId) {
      return _.contains($rootScope.currentUser.contacts, contactId);
    };
    
    $rootScope.loadUser = function() {
      User.getCurrentUser(function(user) {
        $rootScope.data = {};
        $rootScope.currentUser = user;
        $rootScope.currentUserId = user._id;
        $rootScope.conversations = {};
        
        socket.emit('current:user', $rootScope.currentUserId);
        
        User.getUserContacts($rootScope.currentUserId, function(data) {
          $rootScope.userContacts = data;
        });
      
      });
      
    };


  
  })

  .controller('MainCTRL', function($scope, $log, User, Conversation, socket, $timeout) {



    $scope.loadConversation = function(userID) {
      var data = [];  
      $scope.data.to = userID;    
      
      data.push($scope.currentUserId, userID);

	    Conversation.getConversation(data, function(data) {
        console.log("dattt", data);

        $scope.conversations[data._id] = data;
	    	$scope.conversation = $scope.conversations[data._id];
        console.log($scope.conversation);
        $scope.conversationId = data._id;
        $scope.data.to = $scope.conversation.members.filter(function(user) {
          return user._id != $scope.currentUserId;
        });
        console.log("after, ", $scope.data.to)
	    	$scope.loadChat = true;
	    }); 	

    };

    $scope.sendNewMessage = function() {      
      if ($scope.data.newMessage) {
        var data = {
          currentUserId: $scope.currentUserId,
          conversationId: $scope.conversationId,
          newMessage: $scope.data.newMessage,
          to: $scope.data.to
        };
        console.log("message to sent ", data);
        socket.emit('send-new:message', data, function(error, result) {
          if(error) {
            alert("something went wrong");
          } else if(result) {
            var messageArray = result.messages;
            var message = messageArray[messageArray.length-1];
            console.log("messageeee", message);

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
      console.log("message arrived");
      var messageArray = result.messages;
      var message = messageArray[messageArray.length-1];
      $scope.playMessage();

      if($scope.conversationId == result._id) {
        $scope.conversation.messages.push(message);
      }
    });
 
    User.getAllUsers(function(data) {
      $scope.users = data; 
    });





  });
