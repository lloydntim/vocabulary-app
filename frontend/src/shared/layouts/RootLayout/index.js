import React from 'react';
import {
  oneOfType,
  arrayOf,
  node,
  oneOf,
} from 'prop-types';
import jwtDecode from 'jwt-decode';

import RootLayoutGuestView from './RootLayoutGuestView';
import RootLayoutUserView from './RootLayoutUserView';

import './RootLayout.scss';

/* eslint-disable react/jsx-props-no-spreading */
const RootLayout = ({ children, type }) => {
  /* eslint-disable no-undef */
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : {};

  return (
    <>
      <div>
        {type === 'guest' ? (
          <RootLayoutGuestView>
            {children}
          </RootLayoutGuestView>
        ) : (
          <RootLayoutUserView currentUser={user}>
            {children}
          </RootLayoutUserView>
        )}
      </div>
    </>
  );
};

RootLayout.defaultProps = {
  type: 'user',
};
RootLayout.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  type: oneOf(['guest', 'user']),
};

export default RootLayout;
