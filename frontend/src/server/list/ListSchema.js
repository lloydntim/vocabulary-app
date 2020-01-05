import { Schema } from 'mongoose';

const ListSchema = new Schema({
  name: { type: String, required: true, unique: true },
  data: [String],
}, { collection: 'list' });

export default ListSchema;
