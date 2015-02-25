var Conversation = require('../models/conversation');

module.exports = function(socket) {
	socket.on('current:user', function(currentUserId) {
		// console.log("CR", currentUserId)
		sockets[currentUserId] = socket.id;	
		console.log("sockets : ", sockets);
	});

	

	socket.on('send-new:message', function(data, callback) {
		console.log("aaqqq", data);
		var sendTo = sockets[data.to[0]._id];
		var messageData = {
			id: data.conversationId,
			currentUserId: data.currentUserId,
			newMessage: data.newMessage
		};

		Conversation.addNewMessage(messageData, function(err, message) {
			if(err) {
				callback(err, null);
			} else if(message) {

				socket.broadcast.to(sendTo).emit('new:message', message);
				callback(null, message);
			}
		});
	});

};
