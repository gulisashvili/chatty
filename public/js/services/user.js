angular.module('Chatty')
	.factory('User', function($http) {
		return {
			getCurrentUser: function(cb) {
				$http.get('/current').
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
			getAllUsers: function(cb) {
				$http.get('/api/v1/user/all').
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
			getUserByUserName: function(username, cb) {
				var url = '/api/v1/user/' + username;
				if(username) {
					$http.get(url).
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
			},
			addContact: function(data, cb) {
				var url = '/api/v1/user/add/contact';

				$http.post(url, data).
		  		success(function(data, status, headers, config) {
		    		cb(data, status, headers, config);
		  		}).
		  		error(function(data, status, headers, config) {
		    		cb(data, status, headers, config);
		  		});	
			},
			removeContact: function(data, cb) {
				var url = '/api/v1/user/remove/contact';

				$http.post(url, data).
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
			getUserContacts: function(userId, cb) {
				$http.get('/api/v1/user/' + userId + '/get/contacts').
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
