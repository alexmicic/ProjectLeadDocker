var mongoose = require('mongoose');
var Project = require('./project');
var User = require('./user');
var Issue = require('./issue');

// define the model for the comment
var commentSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  desc: { type: String, default: '' },
  dateCreated: { type: Date, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userFullName: { type: String, default: '' },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }
});

module.exports = mongoose.model('Comment', commentSchema);
