var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var ConversationSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ author: {type: Schema.Types.ObjectId, ref: 'User'}, message: String, date: { type: Date}}]
});



ConversationSchema.statics.getConversationByMembers = function(members, cb) {
  return this.findOne({members: {$all: members}})
  	.populate('members', 'username email')
	  .populate('messages.author', 'username email')
	  .exec(function (err, conversation) {
	    if (err) {
	      return cb(err, null);
	    } else {
	      return cb(null, conversation);
	    }          
  	});
};

ConversationSchema.statics.getConversationsByMember = function(member, cb) {
	return this.find({members: member})
		.populate('members', 'username email')
	  .exec(function (err, conversations) {
	  	console.log(err);
	    if (err) {
	      return cb(err, null);
	    } else {
	    	console.log("cc", conversations);
	      return cb(null, conversations);
	    }          
  	});
};

ConversationSchema.statics.getGroupConversationsByMember = function(member, cb) {
	return this.find({members: member, $where: "this.members.length > 2" })
		.populate('members', 'username email')
	  .exec(function (err, conversations) {
	  	console.log(err);
	    if (err) {
	      return cb(err, null);
	    } else {
	      return cb(null, conversations);
	    }          
  	});
};








ConversationSchema.statics.getConversation = function(conversationId, cb) {
  return this.findOne( { _id: conversationId}, cb);
};

ConversationSchema.statics.getConversation = function(conversationId, cb) {
  return this.findOne( { _id: conversationId}, cb);
};

ConversationSchema.statics.createNew = function(members, cb) {
	var Conversation = this;
	var newConversation = new Conversation();

	_.each(members, function(member) {
		newConversation.members.push(member);
	});

	newConversation.save(cb);
};


ConversationSchema.statics.addNewMessage = function(data, cb) {
	return this.findOne({ _id: data.id}, function(err, conversation) {
		conversation.messages.push({
			author: data.currentUserId,
			message: data.newMessage,
			date: new Date()
		});
		conversation.save(cb);
	});
};


module.exports = mongoose.model('Conversation', ConversationSchema);
