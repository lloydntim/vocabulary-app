import React from 'react';
import { useTranslation } from 'react-i18next';

import './AboutPage.scss';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page page">
      <div className="content">
        <h1>{t('about_title')}</h1>
        <h3>{t('about_subTitle')}</h3>
        <p>
          {t('about_introduction')}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
