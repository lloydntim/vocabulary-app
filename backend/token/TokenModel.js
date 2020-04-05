import mongoose from 'mongoose';
import TokenSchema from './TokenSchema';

export default mongoose.model('Token', TokenSchema);
