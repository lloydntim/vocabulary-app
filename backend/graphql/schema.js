import { gql } from 'apollo-server-express';
import {
  register,
  login,
  createPasswordToken,
  getPasswordToken,
  updatePassword,
} from '../auth/AuthController';

import {
  getList,
  getLists,
  addList,
  updateList,
  removeList,
} from '../list/ListController';

import {
  getUser,
  getUsers,
  updateUser,
  removeUser,
} from '../user/UserController';

export const typeDefs = gql`
  type User {
    id: ID
    username: String
    email: String
    password: String
    refreshToken: String
    accessToken: String
  }

  type Auth {
    user: User
    token: String
    info: String
    message: String
  }

  type List {
    id: ID!
    name: String
    data: [[String]]
    creatorId: ID
  }
  
  type Query {
    getPasswordToken(resetPasswordToken: String):Auth

    getUsers: [User]
    getUser(id: ID, username: String, email: String): User

    getLists(creatorId:ID): [List]
    getList(id: ID, name: String): List
  }
  
  type Mutation {
    register(username: String, email: String, password: String): Auth
    login(username: String, password: String): Auth
    createPasswordToken(email: String): Auth
    updatePassword(resetPasswordToken: String, password: String): Auth
    updateUser(id: ID, username: String, password: String): User
    removeUser(id: ID): User

    addList(name: String!, file: Upload, data: [[String]], creatorId: ID!): List
    updateList(id: ID!, name: String, file: Upload, data: [[String]]): List
    removeList(id: ID!): List
  }
`;

export const resolvers = {
  Query: {
    getPasswordToken,
    getUser,
    getUsers,
    getList,
    getLists
  },
  Mutation: {
    login,
    register,
    createPasswordToken,
    updatePassword,
    updateUser,
    removeUser,
    addList,
    updateList,
    removeList
  }
};
