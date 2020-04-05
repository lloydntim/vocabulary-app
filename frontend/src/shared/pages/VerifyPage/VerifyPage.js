import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';

import { RootLayout } from '../../layouts';
import { Message } from '../../components';

import './VerifyPage.scss';

export const VERIFY = gql`
  mutation Verify($token: String) {
    verify(token: $token) {
      token
    }
  }
`;

const VerifyPage = () => {
  const { t } = useTranslation();
  const { token: verificationToken } = useParams();
  const { push } = useHistory();

  /* eslint-disable  no-undef */
  const token = localStorage.getItem('token') || '';
  const creatorId = token ? jwtDecode(token).id : '';
  if (!creatorId) return <Redirect to="/" />;

  const [
    verify,
    { data, loading: verifyMutationLoading, error: verifyMutationError },
  ] = useMutation(VERIFY, {
    onCompleted: ({ verify }) => {
      /* eslint-disable no-undef */
      localStorage.setItem('token', verify.token);
      push(`/user/${creatorId}`);
    },
  /*   onError: (error) => {
      console.log('error', error);
    }, */
  });

  useEffect(() => {
    const fetchVerification = () => verify({ variables: { token: verificationToken } });
    fetchVerification();
  }, []);

  return (
    <RootLayout>
      <div className="verify-page page">
        <div className="content">
          <h1>{t('verify_title_emailVerification')}</h1>
          {!data && (
            <div>.</div>
          )}

          {verifyMutationLoading && <Message type="info" content={t('messages_info_loading')} /> }
          {verifyMutationError && <Message type="error" content={t('messages_error_pleaseTryAgain')} />}
        </div>
      </div>
    </RootLayout>
  );
};
export default VerifyPage;
