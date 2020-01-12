import { AuthenticationError } from 'apollo-server-express';
import xlsx from 'node-xlsx';
import List from './ListModel';

export const getList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { id, name } = args;
    return id ? await List.findById(id) : await List.findOne({ name });
  } catch (error) {
    throw new Error(`List with id ${id} could not be retrieved`);
  }
};

export const getLists = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { creatorId } = args;
    return await List.find({ creatorId });
  } catch (error) {
    throw new Error('Lists could not be retrieved');
  }
};

export const addList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { file, name, creatorId } = args;
    const { createReadStream } = await file;
    const bufferArray = [];

    const newList = await new Promise((res) => (
      createReadStream()
        .on('data', (chunk) => {
          bufferArray.push( chunk );
        })
        .on('error', (error) => {
          throw new Error(error);
        })
        .on('end', () => {
          console.info('File successfully processed');
          const buffer = Buffer.concat(bufferArray);
          const [ list ] = xlsx.parse(buffer);
          res(List.create({ name, data: list.data, creatorId }));
        })
        .on('close', (e) => {
          console.log('File stream closed.')
        })
      )
    );
    return newList;
  } catch (error) {
    throw new Error ('List could not be added.');
  };  
};

export const updateList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { id, name } = args;
    return await List.findByIdAndUpdate(id, { $set: { name } }, { new: true });
  } catch (error) {
    throw new Error('List could not be updated');
  };
};

export const removeList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    return await List.findOneAndDelete({ _id: args.id });
  } catch (error) {
    throw new Error('List could not be removed');
  };
};

export default {
  getList,
  getLists,
  addList,
  updateList,
  removeList
};
