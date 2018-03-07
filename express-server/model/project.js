var mongoose = require('mongoose');

// define the model for the project
var projectSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  name: { type: String, default: '' },
});

module.exports = mongoose.model('Project', projectSchema);
