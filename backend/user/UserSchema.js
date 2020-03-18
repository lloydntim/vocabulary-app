import { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date

}, {
  collection: 'user',
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});

export default UserSchema;
