
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootLayout } from '../../layouts';
import { Button } from '../../components';

import './IntroPage.scss';

const IntroPage = () => {
  const { push } = useHistory();
  const { t } = useTranslation();

  return (
    <RootLayout type="guest">
      <div className="intro-page page">
        <h2>{t('intro_title')}</h2>
        <form>
          <Button
            rank="primary"
            text={t('common_button_signup')}
            onClick={() => push('/signup')}
          />
          <Button
            rank="primary"
            text={t('common_button_login')}
            onClick={() => push('/login')}
          />
        </form>
      </div>
    </RootLayout>
  );
};

export default IntroPage;
