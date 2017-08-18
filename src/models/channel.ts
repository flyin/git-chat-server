import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Channel = new Schema({
  name: { required: true, type: String },

  owner: {
    _id: {
      ref: 'User',
      type: Schema.Types.ObjectId
    },

    username: { type: String }
  }
}, {
  timestamps: true
});

mongoose.model('Channel', Channel);
