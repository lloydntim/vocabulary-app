import { AuthenticationError } from 'apollo-server-express';
import User from './UserModel';

export const getUser = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    return args.id ?
      await User.findById(args.id).select({ password: 0, __v: 0 })
      : await User.findOne({ username: args.username }).select({ password: 0, __v: 0 });
  } catch (error) {
    throw new Error(`User with id ${id} could not be retrieved`);
  }
};

export const getUsers = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    return await User.find({}).select({ password: 0, __v: 0 });
  } catch (error) {
    throw new Error(`Users could not be retrieved`);
  }
};

export const updateUser = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');

  try {
    let $set = {};
    const { id, email } = args;
    if (email) $set.email = email;

    return await User
      .findByIdAndUpdate(id, { $set }, { new: true })
      .select({ password: 0, __v: 0 });
  } catch (error) {
    throw new Error('User could not be updated');
  }
};

export const removeUser = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AßuthenticationError('User must be logged in!');
  try {
    const removedUser = User.findOneAndRemove({ _id: args.id });
    return removedUser;
  } catch (error) {
    throw new Error('User could not be updated');
  }
};

export default {
  getUser,
  getUsers,
  updateUser,
  removeUser,
};
