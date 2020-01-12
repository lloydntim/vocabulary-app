import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

export const getCurrentUser = token => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { ...user, ...{ loggedIn: true } };
  } catch (error) {
    return {
      error,
      errorMessage: 'Failed to Authenticate',
      loggedIn: false,
    };
  }
};

