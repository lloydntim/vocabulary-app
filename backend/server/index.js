import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import { typeDefs, resolvers } from '../graphql/schema';
import { getCurrentUser } from '../middleware';

dotEnv.config();

const { HOST, PORT, MONGODB_URI } = process.env;
const app = new Express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
    const currentUser = getCurrentUser(token);

    return {
      currentUser,
    };
  },
  formatError: (error) => {
    throw Error(error.message);
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://${HOST}:${PORT}`,
));

mongoose.connect(MONGODB_URI);
mongoose.connection.once('open', () => {
  console.log('Database connected');
});
