angular.module('Chatty')
	.filter('timeAgo', function() {
		return function(date) {
			return moment(date).fromNow();
		};
	});
