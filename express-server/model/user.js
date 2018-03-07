var mongoose = require('mongoose');
var Team = require('./team');

// define the model for the user
var userSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dateCreated: { type: Date, default: Date.now },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  admin: { type: Boolean, default: false },
  teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}]
});

module.exports = mongoose.model('User', userSchema);
