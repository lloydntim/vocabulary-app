// ./routes/Layout.js
import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';

// A Routes file is a good shared entry-point between client and server
import routes from '../routes';

/* eslint-disable react/jsx-props-no-spreading */
const MainLayout = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/signup">SignUp</Link>
        </li>
        <li>
          <Link to="/">Login</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>

    <Switch>
      {routes.map((route) => <Route key={route.name} {...route} />)}
    </Switch>
  </div>
);

export default MainLayout;
