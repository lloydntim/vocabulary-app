// import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLID, GraphQLNonNull } from 'graphql';
import List from '../list/ListModel';
import { gql } from 'apollo-server-express';
import xlsx from 'node-xlsx';

export const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  input ListInput {
    name: String
    file: Upload
  }
  
  type List {
    id: ID
    name: String
  }
  
  type Query {
    getList(id: ID, name: String) : List
    getLists: [List]
  }
  
  type Mutation {
    uploadFile(file: Upload!): File!
    addList(input: ListInput): List
    updateList(id: ID, input: ListInput): List
    removeList(id: ID): List
  }
`;

export const resolvers = {
  Query: {
    getList: (parent, args) => {
      const { id, name } = args;
      return id ? List.findById(id) : List.findOne({ name });
    },
    getLists: () => List.find({})
  },
  Mutation: {
    addList: (parent, args) => {
      return args.input.file.then(file => {
        file.createReadStream()
        .on('data', (data) => {
          const l = xlsx.parse(data);
          console.log(l);
          List.create({ name: args.input.name, data: l.data });
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
        });
        return file;
      }).catch((error) => {
        console.log('error', error);
      });
    },
    updateList: (parent, args) => {
      const { id, input } = args;

      return List.findByIdAndUpdate(id, { $set: input }, { new: true })
    },
    removeList: (parent, args) => {
      return List.findOneAndRemove({ _id: args.id });
    },
  }
};
