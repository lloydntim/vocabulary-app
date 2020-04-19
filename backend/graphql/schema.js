import { gql } from 'apollo-server-express';
import {
  register,
  login,
  verify,
  resendVerificationToken,
  createPasswordToken,
  getPasswordToken,
  updatePassword,
} from '../auth/AuthController';

import {
  getListVocabSound,
  getListVocabTranslation,
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
  scalar Date

  type User {
    id: ID
    username: String
    email: String
    password: String
    isVerified: String
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
    createdAt: Date
    updatedAt: Date
  }

  type Translation {
    targetText: String
  }

  type TextToSpeech {
    audioLink: String
  }

  type Query {
    getPasswordToken(resetPasswordToken: String):Auth

    getUsers: [User]
    getUser(id: ID, username: String, email: String): User

    getLists(creatorId:ID): [List]
    getList(id: ID, name: String): List

    getListVocabTranslation(sourceLanguage: String, targetLanguage: String, sourceText: String):Translation

    getListVocabSound(text: String, languageCode: String): TextToSpeech
  }

  type Mutation {
    register(username: String, email: String, password: String): Auth
    login(username: String, password: String): Auth
    verify(token: String):Auth
    resendVerificationToken(username: String, email: String):Auth
    createPasswordToken(username: String): Auth
    updatePassword(resetPasswordToken: String, password: String): Auth
    updateUser(id: ID, username: String, email: String): User
    removeUser(id: ID): User

    addList(name: String!, file: Upload, data: [[String]], creatorId: ID!): List
    updateList(id: ID!, name: String, file: Upload, data: [[String]]): List
    removeList(id: ID, creatorId: ID): List
  }
`;

export const resolvers = {
  Query: {
    getPasswordToken,
    getUser,
    getUsers,
    getList,
    getLists,
    getListVocabTranslation,
    getListVocabSound,
  },
  Mutation: {
    login,
    register,
    verify,
    resendVerificationToken,
    createPasswordToken,
    updatePassword,
    updateUser,
    removeUser,
    addList,
    updateList,
    removeList,
  }
};
