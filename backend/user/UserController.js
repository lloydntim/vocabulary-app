import { AuthenticationError } from 'apollo-server-express';
import User from './UserModel';

export const getUser = async (parent, args, { currentUser, t, Sentry }) => {
  Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn) throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return args.id ?
      await User.findById(args.id).select({ password: 0, __v: 0 })
      : await User.findOne({ username: args.username }).select({ password: 0, __v: 0 });
  } catch (error) {
    Sentry.captureException(error);
    throw new AuthenticationError(t('user_error_listCouldNotBeRetrieved', { id: args.id }));
  }
};

export const getUsers = async (parent, args, { currentUser, t, Sentry }) => {
  Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn) throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return await User.find({}).select({ password: 0, __v: 0 });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(t('user_error_usersCouldNotBeRetrieved'));
  }
};

export const updateUser = async (parent, args, { currentUser, t }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    let $set = {};
    const { id, email } = args;
    if (email) $set.email = email;

    return await User
      .findByIdAndUpdate(id, { $set }, { new: true })
      .select({ password: 0, __v: 0 });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(t('user_error_userCouldNotBeUpdated'));
  }
};

export const removeUser = async (parent, args, { currentUser, t, Sentry }) => {
  Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn) throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    const removedUser = User.findOneAndRemove({ _id: args.id });
    return removedUser;
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(t('user_error_userCouldNotBeRemoved'));
  }
};

export default {
  getUser,
  getUsers,
  updateUser,
  removeUser,
};
