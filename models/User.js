const pick = require('lodash/pick');
const mongoose = require('../lib/mongoose');

const publicFields = ['email', 'displayName']
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'Укажите email',
    unique: 'Такой email уже существует',
    validate: [{
      validator(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      message: 'Укажите, пожалуйста, корректный email'
    }],
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует',
  }
}, {
  timestamps: true,
  toObject: {
    transform(doc, ret, options) {
      return pick(ret, [...publicFields, '_id']);
    }
  }
});

userSchema.statics.publicFields = publicFields;

module.exports = mongoose.model('User', userSchema);
