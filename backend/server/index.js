import { resolve } from 'path';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import mongoose from 'mongoose';

import i18next from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';

import dotEnv from 'dotenv';
import { typeDefs, resolvers } from '../graphql/schema';
import { getCurrentUser } from '../middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const { NODE_ENV, HOST, PORT, MONGODB_URI, MONGODB_DEV_URI } = process.env;
const app = new Express();

dotEnv.config();

import translationEn from '../locales/en/translation.json';
import translationDe from '../locales/de/translation.json';
import translationEs from '../locales/es/translation.json';
import translationPt from '../locales/pt/translation.json';
import translationFr from '../locales/fr/translation.json';

i18next
  // .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: true,
    // backend: {
    //   loadPath: resolve(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    //   addPath: resolve(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
    // },
    resources: {
      en: {
        translation: translationEn,
      },
      de: {
        translation: translationDe,
      },
      es: {
        translation: translationEs,
      },
      pt: {
        translation: translationPt,
      },
      fr: {
        translation: translationFr,
      },
    },
    fallbackLng: 'en',
    preload: ['en', 'de', 'es', 'pt', 'fr'],
    saveMissing: true
  });

// app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3005' : 'https://thevocapp.netlify.com',
  credentials: true,
}));
app.use(i18nextMiddleware.handle(i18next));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req: { headers: { authorization, custom: cookiesFallback }, t, i18n/*,  cookies: { i18next } */ } }) => {
    const token = authorization ? authorization.split(' ')[1] : '';
    console.log('cookiesFallback', cookiesFallback);
    // console.log('i18next', i18next);
    const currentUser = getCurrentUser(token);
    const cookies = cookiesFallback.split(';').reduce((object, cookieData) => {
      const [key, value] = cookieData.split('=');
      const formattedKey = key.trim().replace(/-[a-z0-9]/g, (v) => String.prototype.toUpperCase.apply(v.substring(1)));
      object[formattedKey] = value;
      return object;
    }, {});
    const currentLanguage = /* i18next || */ cookies.i18next;
    i18n.changeLanguage(cookies.i18next);
    console.log(t('auth_email_subject_passwordReset'));

    return { t, currentUser };
  },
  formatError: (error) => {
    console.log('Error', error.message);
    console.log('Error()', Error(error.message));
    throw new Error(error.message);
  },
});
const mongoURI = NODE_ENV === 'development' ? MONGODB_DEV_URI : MONGODB_URI;

server.applyMiddleware({ app, path: '/graphql', cors: false });

app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://${HOST}:${PORT}`,
));

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.once('open', () => console.log('Database connected'));
