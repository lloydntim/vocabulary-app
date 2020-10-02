// ./routes/Layout.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  oneOfType,
  arrayOf,
  node,
  object,
  func,
} from 'prop-types';

import { Logo, IconButton } from '../../components';
import Overlay from '../Overlay/Overlay';

/* eslint-disable react/jsx-props-no-spreading, no-undef, no-restricted-globals */
const RootLayoutUserView = ({
  children,
  currentUser,
  onOpenMenuButtonClick,
  onCloseMenuButtonClick,
}) => {
  const { t } = useTranslation();
  const [isOverlayVisible, setOverlayVisibility] = useState(false);

  return (
    <>
      <Overlay
        isVisible={isOverlayVisible}
        onCloseButtonClick={() => {
          setOverlayVisibility(false);
          if (onCloseMenuButtonClick) onCloseMenuButtonClick();
        }}
      >
        <h1>{t('menu_title')}</h1>
        <nav className="menu">
          <ul>
            <li>
              {!window.location.href.includes('user') ? <Link to={`/user/${currentUser.id}`}>{t('profile_title')}</Link> : <span>{t('profile_title')}</span>}
            </li>
            <li>
              {!window.location.href.includes('vocablists') ? <Link to="/vocablists">{t('vocablists_title')}</Link> : <span>{t('vocablists_title')}</span>}
            </li>
            <li>
              {!window.location.href.includes('about') ? <Link to="/about">{t('about_title')}</Link> : <span>{t('about_title')}</span>}
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
          type="menu"
          rank="primary"
          onClick={() => {
            setOverlayVisibility(true);
            if (onOpenMenuButtonClick) onOpenMenuButtonClick();
          }}
        />
        <Logo isTextOnly />
      </div>

      {children}

    </>
  );
};

RootLayoutUserView.defaultProps = {
  onOpenMenuButtonClick: null,
  onCloseMenuButtonClick: null,
};

RootLayoutUserView.propTypes = {
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
  currentUser: object.isRequired,
  onOpenMenuButtonClick: func,
  onCloseMenuButtonClick: func,
};

export default RootLayoutUserView;
