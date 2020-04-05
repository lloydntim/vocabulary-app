import { Schema } from 'mongoose';

const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    expires: 43200,
    default: Date.now,
  },
}, {
  collection: 'token',
  timestamps: true,
});

export default TokenSchema;
