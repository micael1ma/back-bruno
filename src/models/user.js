const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  password: { type: String, required: true },
});

// Antes de salvar, transformar a senha em hash
userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) next(err);
      else {
        this.password = hashedPassword;
        next();
      }
    });
  }
});

userSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, same) => {
    if (err) callback(err);
    else callback(null, same);
  });
};

module.exports = mongoose.model('User', userSchema);
