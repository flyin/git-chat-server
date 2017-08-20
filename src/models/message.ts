import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Message = new Schema({
  channel: {
    _id: {
      ref: 'Channel',
      type: Schema.Types.ObjectId
    },

    name: { type: String }
  },

  text: { required: true, type: String }
}, {
  timestamps: true
});

export default mongoose.model('Message', Message);
