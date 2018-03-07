var mongoose = require('mongoose');
var Project = require('./project');
var User = require('./user');

// define the model for the board
var boardSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  name: { type: String, default: '' },
  type: { type: String, default: 'SCRUM' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  columns: [{ type: String, default: 'TODO' }]
});

module.exports = mongoose.model('Board', boardSchema);
