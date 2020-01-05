import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import mongoose from 'mongoose';
import { typeDefs, resolvers } from '../graphql/schema';
import { ListController } from '../list';

const basePort = 3000;

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = new Express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: ({ req }) => {
  //   return {
  //     controllers: {
  //       // List: ListController,
  //     }
  //   };
  // },
  formatError: (error) => {
    throw Error(error.message);
    // TODO: https://medium.com/@estrada9166/return-custom-errors-with-status-code-on-graphql-45fca360852
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(basePort, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://localhost:${basePort}`,
));

// TODO Move to database file

mongoose.connect('mongodb://admin:admin12@ds259738.mlab.com:59738/heroku_1283rdnq');
mongoose.connection.once('open', () => {
  console.log('Database connected');
});
