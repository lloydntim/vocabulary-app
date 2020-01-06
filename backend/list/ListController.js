import xlsx from 'node-xlsx';
import List from './ListModel';

export const getList = (parent, args) => {
  const { id, name } = args;
  return id ? List.findById(id) : List.findOne({ name });
};

export const getLists = () => List.find({});

export const addList = async (parent, args) => {
  const {file, name } = args.input;
  const { createReadStream } = await file;
  const bufferArray = [];

  await new Promise((res) => (
    createReadStream()
      .on('data', (chunk) => {
        bufferArray.push( chunk );
      })
      .on('error', (error) => {
        console.log('error', error);
      })
      .on('end', () => {
        console.log('File successfully processed');
        const buffer = Buffer.concat(bufferArray);
        const { data } = xlsx.parse(buffer);
        List.create({ name, data });
      })
    )
  );
};

export const updateList = (parent, args) => {
  const { id, input } = args;

  return List.findByIdAndUpdate(id, { $set: input }, { new: true })
};

export const removeList = (parent, args) => {
  return List.findOneAndRemove({ _id: args.id });
};

export default {
  getList,
  getLists,
  addList,
  updateList,
  removeList
};
