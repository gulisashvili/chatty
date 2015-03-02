var Conversation = require('../models/conversation');
var _ = require('underscore');

module.exports = function(socket) {
	socket.on('current:user', function(currentUserId, callback) {
			sockets[currentUserId] = socket.id;
			
			onlineUsers.push(currentUserId);	

			console.log("Online USers , : ", onlineUsers);		
			
			socket.broadcast.emit('is:online', currentUserId);
    	callback(null, onlineUsers);
			
			socket.on('disconnect', function() {
				var index = onlineUsers.indexOf(currentUserId);
				if(index > -1) {
					onlineUsers.splice(index, 1);
				}
				console.log("Online USers , : After Delete", onlineUsers);		

		  	socket.broadcast.emit('is:offline', currentUserId);
			});
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
					   if(data.to.length > 2) message.type = 'group';
				 	   
				 	   socket.broadcast.to(sendTo).emit('new:message', message);
				     callback(null, message);  
				   });
    		 });
			}
		});
	});

};
