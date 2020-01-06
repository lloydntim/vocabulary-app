import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider } from '@apollo/react-hooks';

import Layout from '../shared/routes/Layout';

const cache = new InMemoryCache();
const link = createUploadLink({
  uri: 'https://vocab-list-app.herokuapp.com/graphql',
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
      <Layout />
    </Router>
  </ApolloProvider>
);

hydrate(<App />, document.getElementById('root'));
