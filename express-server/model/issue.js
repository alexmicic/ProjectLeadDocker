var mongoose = require('mongoose');
var Board = require('./board');
var User = require('./user');
var Sprint = require('./sprint');

// define the model for the issue
var issueSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  name: { type: String, default: '' },
  desc: { type: String, default: '' },
  priority: { type: String, default: 'LOW' },
  status: { type: String, default: 'OPEN' },
  points: { type: Number, default: '1' },
  date: { type: Date, default: Date.now },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }]
});

module.exports = mongoose.model('Issue', issueSchema);
