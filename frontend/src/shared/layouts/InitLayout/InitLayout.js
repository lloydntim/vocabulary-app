// ./routes/Layout.js
import React from 'react';
import { oneOfType, arrayOf, node } from 'prop-types';

/* eslint-disable react/jsx-props-no-spreading */
const InitLayout = ({ children }) => (
  <div>

    <div className="logo">
      <div className="logo-graphic" />
      <span className="logo-text">
        <span>Voc</span>
        <span>App</span>
      </span>
    </div>

    {children}

  </div>
);

InitLayout.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
};

export default InitLayout;
