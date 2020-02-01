import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider } from '@apollo/react-hooks';

/* eslint-disable react/jsx-props-no-spreading */
import routes from '../shared/routes';

const uri = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/graphql' : 'https://vocab-list-app.herokuapp.com/graphql';
const cache = new InMemoryCache();
const link = createUploadLink({ uri });

const authLink = setContext((parent, { headers }) => {
  /* eslint-disable no-undef */
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
  connectToDevTools: true,
});

/* eslint-disable no-undef */
const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        {routes.map((route) => <Route key={route.name} {...route} />)}
      </Switch>
    </Router>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));
