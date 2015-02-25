angular.module('Chatty')

  .controller('HeaderCTRL', function($scope, $log, User, $modal) {

    
    
    $scope.searchUser = function(searchUserVal) {
      User.getUserByUserName(searchUserVal, function(data) {
        $scope.userResult = data;

      });
    };

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'all-users.html',
      controller: 'AllUsersModalCTRL',
      size: size,
      resolve: {
        allUsers: function () {
          User.getAllUsers(function(users) {
            return users;            
          })
        }
      }
    });
  };

  $scope.openMessagesModal = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'messages-list.html',
      controller: 'AllMessagesCTRL',
      size: size,
      resolve: {
        allUsers: function () {
          User.getAllUsers(function(users) {
            return users;            
          })
        }
      }
    });
  };



    $scope.addContact = function(newContact) {
      var data = {
        id: $scope.currentUserId,
        newContactId: newContact._id
      };

      $scope.userResult = false;

      User.addContact(data, function(result) {
        console.log("Result", result);
      });
    }

    $scope.onLostFocus = function() {
      $scope.userResult = false;
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

  })


.controller('AllUsersModalCTRL', function($rootScope, $scope, $modalInstance, User, $window) {
  
  User.getAllUsers(function(users) {
    $scope.users = users;
  });

  $scope.done = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addToContacts = function(newContact) {
    var data = {
      id: $scope.currentUserId,
      newContactId: newContact._id
    };
    
    User.addContact(data, function(res, status) {
      if(status == 200) {
        $modalInstance.dismiss('cancel');
        $window.location.reload();
        // $rootScope.userContacts.push(newContact);
      }
    });
  
  };

  $scope.removeContact = function(contact) {
    var data = {
      id: $scope.currentUserId,
      contactId: contact._id
    };
    User.removeContact(data, function(res, status) {
      if(status == 200) {
        $modalInstance.dismiss('cancel');
        $window.location.reload();

        // $rootScope.userContacts = $rootScope.userContacts.filter(function(user) {
        //   return user._id != contact._id;
        // });
      }
    });
  }

})


.controller('AllMessagesCTRL', function($scope, Conversation, $modalInstance) {

  Conversation.getConversationsByMember($scope.currentUserId, function(conversations) {
    $scope.allConversations = conversations;
  });
   
  $scope.done = function() {
    $modalInstance.dismiss('cancel');
  };






});
