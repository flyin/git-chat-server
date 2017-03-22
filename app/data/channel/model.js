const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;

const Channel = new Schema({
  createdBy: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  },

  name: { required: true, type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Channel', Channel);
