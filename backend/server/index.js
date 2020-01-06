import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import mongoose from 'mongoose';
import { typeDefs, resolvers } from '../graphql/schema';

const basePort = process.env.PORT || 3000;
const app = new Express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    throw Error(error.message);
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(basePort, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://localhost:${basePort}`,
));

mongoose.connect('mongodb://admin:admin12@ds259738.mlab.com:59738/heroku_1283rdnq');
mongoose.connection.once('open', () => {
  console.log('Database connected');
});
