// ./routes/Layout.js
import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

// A Routes file is a good shared entry-point between client and server
import routes from '.';

/* eslint-disable react/jsx-props-no-spreading */
const Layout = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/another">Another page</Link>
        </li>
      </ul>
    </nav>

    {/* New <Switch> behavior introduced in React Router v4
       https://reacttraining.com/react-router/web/api/Switch */}
    <Switch>
      {routes.map((route) => <Route key={route.name} {...route} />)}
    </Switch>
  </div>
);

export default Layout;
