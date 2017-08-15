const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  channel: {
    _id: {
      ref: 'Channel',
      type: Schema.Types.ObjectId
    },

    name: { type: String }
  },

  text: { required: true, type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', schema);
