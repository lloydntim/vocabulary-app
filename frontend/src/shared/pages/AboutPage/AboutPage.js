import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RootLayout } from '../../layouts';
import { Icon } from '../../components';

import './AboutPage.scss';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <RootLayout>
      <div className="about-page page">
        <div className="content">
          <h1>{t('about_title')}</h1>
          <div className="sub-header">
            <Link to="/vocablists">
              <Icon type="home" />
            </Link>
            <h3>{t('about_subTitle')}</h3>
          </div>

          <p>
            {t('about_introduction')}
          </p>
        </div>
      </div>
    </RootLayout>
  );
};

export default AboutPage;
