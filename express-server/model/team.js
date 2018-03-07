var mongoose = require('mongoose');
var Project = require('./project');
var User = require('./user');

// define the model for the team
var teamSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  name: { type: String, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Team', teamSchema);
