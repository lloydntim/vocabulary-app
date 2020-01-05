import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
// import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import { ApolloProvider } from '@apollo/react-hooks';

import Layout from './routes/Layout';

const insertCss = (...styles) => {
  const removeCss = styles.map((style) => style._insertCss());
  return () => removeCss.forEach((dispose) => dispose());
};

const cache = new InMemoryCache();
const link = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
});

/* eslint-disable no-undef */
const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <StyleContext.Provider value={{ insertCss }}>
        <Layout />
      </StyleContext.Provider>
    </Router>
  </ApolloProvider>
);

hydrate(<App />, document.getElementById('root'));
