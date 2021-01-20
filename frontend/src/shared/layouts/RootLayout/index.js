import React from 'react';
import {
  oneOfType,
  arrayOf,
  node,
  oneOf,
  func,
} from 'prop-types';
import jwtDecode from 'jwt-decode';

import RootLayoutGuestView from './RootLayoutGuestView';
import RootLayoutUserView from './RootLayoutUserView';

import './RootLayout.scss';

/* eslint-disable react/jsx-props-no-spreading */
const RootLayout = ({
  children,
  type,
  onOpenMenuButtonClick,
  onCloseMenuButtonClick,
}) => {
  /* eslint-disable no-undef */
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : {};
  const isGuest = type === 'guest';

  return (
    <>
      <div className={`root-layout ${isGuest ? 'is-guest' : ''}`}>
        {isGuest ? (
          <RootLayoutGuestView>
            {children}
          </RootLayoutGuestView>
        ) : (
          <RootLayoutUserView
            currentUser={user}
            onOpenMenuButtonClick={onOpenMenuButtonClick}
            onCloseMenuButtonClick={onCloseMenuButtonClick}
          >
            {children}
          </RootLayoutUserView>
        )}
        <div className="footer">
          &copy; 2019 -&nbsp;
          {new Date().getFullYear()}
          &nbsp;LN Creative Development Ltd
        </div>
      </div>
    </>
  );
};

RootLayout.defaultProps = {
  type: 'user',
  onOpenMenuButtonClick: null,
  onCloseMenuButtonClick: null,
};

RootLayout.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  type: oneOf(['guest', 'user']),
  onOpenMenuButtonClick: func,
  onCloseMenuButtonClick: func,
};

export default RootLayout;
