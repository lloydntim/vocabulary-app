import List from './ListModel';
import xlsx from 'node-xlsx';

export const getList = (parent, args) => {
  const { id, name } = args;
  return id ? List.findById(id) : List.findOne({ name });
};

export const getLists = () => List.find({});

export const addList = (parent, args) => args.input.file.then(file => {
  file.createReadStream()
    .on('data', (data) => {
      const l = xlsx.parse(data);
      List.create({ name: args.input.name, data: l.data });
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
    return file;
  }).catch((error) => {
    console.log('error', error);
  });

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
