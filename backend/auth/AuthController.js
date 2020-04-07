
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import dotEnv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import User from '../user/UserModel';
import Token from '../token/TokenModel';

dotEnv.config();

const {
  NODE_ENV,
  HOST,
  CLIENT_DEV_PORT,
  CLIENT_HOST,
  JWT_SECRET,
  NODEMAILER_DOMAIN,
  NODEMAILER_API_KEY,
} = process.env;
const nodemailerAuthConfig = {
  auth: {
    api_key: NODEMAILER_API_KEY,
    domain: NODEMAILER_DOMAIN,
  },
};
const nodemailerMailgun = nodemailer.createTransport(mg(nodemailerAuthConfig));

const sendVerificationEmail =  async ({ email, username, id }, t) => {
  try {
    const { token } = await Token.create({ userId: id, token: crypto.randomBytes(20).toString('hex') });
    const domain = NODE_ENV === 'development' ? `http://${HOST}:${CLIENT_DEV_PORT}` : CLIENT_HOST;
    const mailOptions = {
      to: email,
      from: 'email-verification@lloydntim.com',
      subject: t('auth_email_subject_emailVerification'),
      text: t('auth_email_content_emailVerificationMessage', { username, domain, token, interpolation: { escapeValue: false } }),
    };

    await nodemailerMailgun.sendMail(mailOptions);
  } catch(error) {
    console.log(error);
    throw new ApolloError(error);
  }
};

export const register = async (parent, args, { t }) => {
  const { username, email, password } = args;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    const vToken = await Token.create({ userId: user.id, token: crypto.randomBytes(20).toString('hex') });
    if (!vToken) throw new AuthenticationError(t('token_error_tokenCouldNotBeCreated'));

    sendVerificationEmail(user, t);
    return {
      token: jwt.sign({
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: 60 * 60 }),
    };
  } catch (error) {
    throw new AuthenticationError(t('token_error_tokenCouldNotBeCreated'));
  }
};

export const login = async (parent, args, { t }) => {
  const { username, password } = args;
  try {
    const user = await User.findOne({ username });

    if (!user) throw new AuthenticationError(t('user_error_userCouldNotBeFound', { username }));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AuthenticationError(t('auth_error_incorrectPassword'));

    return {
      token: jwt.sign({
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        {
          expiresIn: 60 * 60,
        }
      ),
    };
  } catch (error) {
    throw error.message;
  }
};

export const verify = async (parent, args, { t }) => {
  const { token } = args;

  try {
    const verificationToken = await Token.findOne({ token });

    if (!verificationToken) throw new AuthenticationError(t('token_error_tokenNotValid'));

    const user = await User.findOne({ _id: verificationToken.userId });

    if (!user) throw new AuthenticationError(t('user_error_userWithIdCouldNotBeFound', { userId: verificationToken.userId }));
    if (user.isVerified) throw new AuthenticationError(t('auth_error_userAlreadyVerified', { username: user.username }));

    user.isVerified = true;
    const updatedUser = await user.save();

    if (!updatedUser) throw new AuthenticationError(t('auth_error_userEmailCouldNotBeVerified'));

    return {
      token: jwt.sign({
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: 60 * 60 }),
    };
  } catch(error) {
    throw new AuthenticationError(error);
  }
};

export const resendVerificationToken = async (parent, args, { t }) => {
  const { email, username } = args;

  try {
    const user = await User.findOne({ email, username });
    if (!user) throw AuthenticationError(t('auth_error_userHasNoSuchEmail', { username }));
    if (user.isVerified) throw new AuthenticationError(t('auth_error_userAlreadyVerified', { username }));

    sendVerificationEmail(user, t);
  } catch(error) {
    throw new AuthenticationError(error);
  }

  return {
    message: t('auth_success_verificationEmailSent'),
  };
};

export const createPasswordToken = async (parent, args, { t }) => {
  const { email } = args;
  try {
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const currentUser = await User.findOneAndUpdate(
      { email },
      { resetPasswordToken, resetPasswordExpires: Date.now() + 3600000 },
      { new: true } );

    if (!currentUser) throw new ApolloError(t('auth_error_couldUpdateUserWithEmail', { email }));

    const domain = NODE_ENV === 'development' ? `http://${HOST}:${CLIENT_DEV_PORT}` : CLIENT_HOST;
    const mailOptions = {
      to: currentUser.email,
      from: 'password-reset@lloydntim.com',
      subject: t('auth_email_subject_passwordReset'),
      text: t('auth_email_subject_passwordResetMessage', { username: currentUser.username, resetPasswordToken, domain, interpolation: { escapeValue: false } }),
    };
    return await nodemailerMailgun.sendMail(mailOptions);
  } catch (error) {
    throw new AuthenticationError(error);
  };
};

export const getPasswordToken = async (parent, args, { t }) => {
  const { resetPasswordToken } = args;
  const currentUser = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });

  if (!currentUser) throw new AuthenticationError(t('auth_error_passwordTokenInvalid'));
  const { id, username, email } = currentUser;
  const token = jwt.sign({
    id,
    username,
    email,
  }, process.env.JWT_SECRET, { expiresIn: 60 * 10 } );
  return { token };
};

export const updatePassword = async (parents, args, { t }) => {
  try {
    const { password, resetPasswordToken } = args;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const currentUser = await User
      .findOneAndUpdate({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
      }, {
        password: hash,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });

    if (!currentUser) throw new AuthenticationError(t('auth_error_passwordTokenInvalid'));

    const { id, username, email } = currentUser;
    const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET, { expiresIn: 60 * 10 });
    const mailOptions = {
      to: email,
      from: 'password-reset@lloydntim.com',
      subject: t('auth_email_subject_passwordChanged'),
      text: t('auth_email_content_passwordChangeMessage', { email, username }),
    };
    nodemailerMailgun.sendMail(mailOptions);
    return { token };
  } catch (error) {
    throw new AuthenticationError(error);
  };
};

export default {
  login,
  register,
  verify,
  resendVerificationToken,
  createPasswordToken,
  getPasswordToken,
  updatePassword,
};
