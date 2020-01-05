import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ApolloProvider } from '@apollo/react-common';
import { ApolloClient } from 'apollo-client';
import fetch from 'node-fetch';
// import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { renderToStringWithData } from '@apollo/react-ssr';
import Express from 'express';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { createHttpLink } from 'apollo-link-http';
import Html from './html';

import Layout from '../shared/routes/Layout';
// import schema from './graphql/schema';
const basePort = 3010;

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = new Express();

app.use((req, res) => {
  const client = new ApolloClient({
    // ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: 'http://localhost:3000/graphql',
      credentials: 'same-origin',
      fetch,
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const context = {};

  // The client-side App will instead use <BrowserRouter>

  const css = new Set();// CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach((style) => css.add(style._getCss()));

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <StyleContext.Provider value={{ insertCss }}>
          <Layout />
        </StyleContext.Provider>
      </StaticRouter>
    </ApolloProvider>
  );

  // rendering code
  // during request
  renderToStringWithData(App).then((content) => {
    const initialState = client.extract();
    const html = <Html content={content} state={initialState} css={css} />;

    res.status(200);
    res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
    res.end();
  });
});


app.listen(basePort, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://localhost:${basePort}`,
));
