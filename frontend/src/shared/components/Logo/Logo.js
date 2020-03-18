import React from 'react';
import { bool } from 'prop-types';

import './Logo.scss';

const Logo = ({ isTextOnly }) => (
  <div className="logo">
    {!isTextOnly && <div className="logo-graphic" />}
    <span className="logo-text">
      <span>Voc</span>
      <span>App</span>
    </span>
  </div>
);

Logo.defaultProps = {
  isTextOnly: false,
};

Logo.propTypes = {
  isTextOnly: bool,
};

export default Logo;
