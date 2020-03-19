import { join } from 'path';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import { typeDefs, resolvers } from '../graphql/schema';
import { getCurrentUser } from '../middleware';

dotEnv.config();

const { NODE_ENV, HOST, PORT, MONGODB_URI, MONGODB_DEV_URI } = process.env;
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
const mongoURI = NODE_ENV === 'development' ? MONGODB_DEV_URI : MONGODB_URI;

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://${HOST}:${PORT}`,
));

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.once('open', () => {
  console.log('Database connected');
});
