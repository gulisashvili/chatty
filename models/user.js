var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {type: String, required: true, unique: true, dropDups: true},
  email: { type: String, required: true },
  password: { type: String, required: true},
  contacts: [{type: Schema.Types.ObjectId, ref: 'User'}]
});



UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // hash the password using our new salt
  bcrypt.hash(user.password, null, null, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
  });
});




UserSchema.methods.validPassword = function(password) {
  var isValid = bcrypt.compareSync(password, this.password);

  return isValid;
};

UserSchema.statics.getAllUsers = function(cb) {
  return this.find({}, 'username email contacts', cb);
};

UserSchema.statics.getUserByUserName = function(username, cb) {
  return this.findOne({username: username}, 'username email', cb);
};


UserSchema.statics.getUserContacts = function(userId, cb) {
  return this.findOne({ _id: userId })
    .populate('contacts', 'username email')
    .exec(function (err, user) {
      if (err) {
        return cb(err, null);
      } else {
        return cb(null, user.contacts);
      }          
  });
};

UserSchema.statics.getUserByID = function(id, cb) {
  return this.findOne({_id: id}, 'username email', cb);
};


UserSchema.statics.addContact = function(options, cb) {
  var user = this;
  
  return user.update({ _id: options.id}, { $addToSet: { contacts: options.newContactId}}, cb);

  
};

UserSchema.statics.removeContact = function(options, cb) {
  var user = this;

  return user.update({ _id: options.id }, { $pull: { contacts: options.contactId }}, cb)

};






module.exports = mongoose.model('User', UserSchema);
