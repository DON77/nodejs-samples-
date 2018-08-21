const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    name: String,
    surename: String,
    email:  { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    partners: [String],
    isOnline: { type: Boolean, default: false }
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
         return next()
     };
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
