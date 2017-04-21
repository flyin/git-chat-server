const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;

const Channel = new Schema({
  name: { required: true, type: String },

  owner: {
    _id: {
      ref: 'User',
      type: Schema.Types.ObjectId
    },

    username: { type: String }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Channel', Channel);
