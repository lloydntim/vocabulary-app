import mongoose from 'mongoose';
import ListSchema from './ListSchema';

export default mongoose.model('List', ListSchema);
