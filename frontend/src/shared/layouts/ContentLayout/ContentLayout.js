// ./routes/Layout.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { oneOfType, arrayOf, node } from 'prop-types';
import jwtDecode from 'jwt-decode';

import { Icon } from '../../components';
import Overlay from '../Overlay/Overlay';

import './ContentLayout.scss';

/* eslint-disable react/jsx-props-no-spreading */
const ContentLayout = ({ children }) => {
  const [isOverlayVisible, setOverlayVisibility] = useState(false);

  /* eslint-disable no-undef */
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : {};

  return (
    <div>

      <Overlay
        isVisible={isOverlayVisible}
        onCloseButtonClick={
          () => { setOverlayVisibility(false); }
        }
      >
        <h1>Menu</h1>

        <nav>
          <ul>
            <li>
              <Link to="/vocablists">Vocab Lists</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {user.id && (
              <li>
                <Link className="button button-secondary" to="/logout">Logout</Link>
              </li>
            )}
          </ul>
        </nav>
      </Overlay>

      <div className="header">
        <button
          className="button-circle button-circle-primary"
          type="button"
          onClick={
            () => {
              setOverlayVisibility(true);
            }
          }
        >
          <Icon type="menu" />
        </button>

        <div className="logo">
          <div className="logo-text">
            <span>Voc</span>
            <span>App</span>
          </div>
        </div>
      </div>

      {children}

    </div>
  );
};

ContentLayout.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
};

export default ContentLayout;
