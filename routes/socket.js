var Conversation = require('../models/conversation');
var _ = require('underscore');

module.exports = function(socket) {
	socket.on('current:user', function(currentUserId) {
		// console.log("CR", currentUserId)
		sockets[currentUserId] = socket.id;	
		console.log("sockets : ", sockets);
	});

	

	socket.on('send-new:message', function(data, callback) {
		console.log("aaqqq", data);
		var messageData = {
			id: data.conversationId,
			currentUserId: data.currentUserId,
			newMessage: data.newMessage
		};

		Conversation.addNewMessage(messageData, function(err, message) {
			if(err) {
				callback(err, null);
			} else if(message) {
				 Conversation.findOne(message).populate('messages.author', 'username email').exec(function (err, message) {
				   _.each(data.to, function(member) {
					   var sendTo = sockets[member._id];
				 	   
				 	   socket.broadcast.to(sendTo).emit('new:message', message);
				     callback(null, message);  
				   });
    		 });
			}
		});
	});

};
