const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
  channel: {
    _id: {
      ref: 'Channel',
      type: Schema.Types.ObjectId
    },

    name: { type: String }
  },

  name: { required: true, type: String },

  sender: {
    _id: {
      ref: 'User',
      type: Schema.Types.ObjectId
    },

    username: { type: String }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', Message);
