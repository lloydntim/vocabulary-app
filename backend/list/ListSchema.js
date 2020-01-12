import { Schema } from 'mongoose';

const ListSchema = new Schema({
  name: { type: String, required: true },
  data: [[String]],
  creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { collection: 'list' });

export default ListSchema;
