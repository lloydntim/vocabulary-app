// ./routes/Layout.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  oneOfType,
  arrayOf,
  node,
  object,
} from 'prop-types';

import { Logo, IconButton } from '../../components';
import Overlay from '../Overlay/Overlay';

/* eslint-disable react/jsx-props-no-spreading */
const RootLayoutUserView = ({ children, currentUser }) => {
  const { t } = useTranslation();
  const [isOverlayVisible, setOverlayVisibility] = useState(false);

  return (
    <>
      <Overlay
        isVisible={isOverlayVisible}
        onCloseButtonClick={() => { setOverlayVisibility(false); }}
      >
        <h1>{t('menu_title')}</h1>
        <nav>
          <ul>
            <li>
              <Link to={`/user/${currentUser.id}`}>{t('profile_title')}</Link>
            </li>
            <li>
              <Link to="/vocablists">{t('vocablists_title')}</Link>
            </li>
            <li>
              <Link to="/about">{t('about_title')}</Link>
            </li>
            {currentUser.id && (
              <li>
                <Link className="button button-secondary" to="/logout">{t('logout_title')}</Link>
              </li>
            )}
          </ul>
        </nav>
      </Overlay>

      <div className="header">
        <IconButton
          icon="menu"
          type="primary"
          onClick={() => setOverlayVisibility(true)}
        />
        <Logo isTextOnly />
      </div>

      {children}

    </>
  );
};

RootLayoutUserView.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  currentUser: object.isRequired,
};

export default RootLayoutUserView;
