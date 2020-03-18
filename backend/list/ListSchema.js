import { Schema } from 'mongoose';

const ListSchema = new Schema({
  name: { type: String, required: true },
  data: [[String]],
  creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  collection: 'list',
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
 });

export default ListSchema;
