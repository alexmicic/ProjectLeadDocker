var mongoose = require('mongoose');
var Board = require('./board');

// define the model for the sprint
var sprintSchema = mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  name: { type: String, default: '' },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  points: { type: Number, default: 0 },
  issueCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('Sprint', sprintSchema);
