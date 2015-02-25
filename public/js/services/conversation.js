angular.module('Chatty')
  .factory('Conversation', function($http) {
    return {
      getConversation: function(data, cb) {
        $http.post('/api/v1/conversation/', data).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            cb(data, status, headers, config);
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            cb(data, status, headers, config);
          });
      },
      getConversationsByMember: function(member, cb) {
        $http.get('/api/v1/conversation/by/' + member).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            cb(data, status, headers, config);
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            cb(data, status, headers, config);
          });
      },
      addNewMessage: function(data, cb) {
        $http.post('/api/v1/conversation/add/new/message', data).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            cb(data, status, headers, config);
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            cb(data, status, headers, config);
          });        
      }
    }
  });
