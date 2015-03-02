angular.module('Chatty')

  .controller('HeaderCTRL', function($scope, $log, User, $modal, $window) {

    
    
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

    $scope.openGroupChatModal = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'group-chat.html',
        controller: 'GroupChatCTRL',
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
        $window.location.reload();
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


.controller('AllUsersModalCTRL', function($rootScope, $scope, User, $window, $modalInstance) {
  
  User.getAllUsers(function(users) {
    $scope.users = users;
  });

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

  $scope.done = function() {
    $modalInstance.dismiss('cancel');
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


.controller('GroupChatCTRL', function($scope, User, Conversation, $modalInstance) {
  $scope.selectedUsers = [];
  $scope.selectedUsers[0] = $scope.currentUserId;


  $scope.done = function() {
    $modalInstance.dismiss('cancel');
  };

  User.getAllUsers(function(users) {
    $scope.users = users;
  });


  $scope.toggleSelected = function(userId, selected) {
    if(selected) {
      $scope.selectedUsers.push(userId);
    } else if(!selected){
      var index = $scope.selectedUsers.indexOf(userId);

      if(index > -1) {
        $scope.selectedUsers.splice(index, 1);
      }
    }
  };

  $scope.createGroupChat = function() {
    if($scope.selectedUsers.length > 2) {
      Conversation.createConversation($scope.selectedUsers, function(result) {
        console.log("returned data : ", result);
      });
    } else {
      alert("ooops minimum 3 members are required");
    }
  };

});
