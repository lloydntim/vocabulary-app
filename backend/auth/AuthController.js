
import { ApolloError } from 'apollo-server-express';
import dotEnv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import User from '../user/UserModel';

dotEnv.config();

const {
  NODE_ENV,
  HOST,
  PORT,
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

export const register = async (parent, { username, email, password }) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    return { user };
  } catch (error) {
    throw new Error('User could not be added', error);
  }
};

export const login = async (parent, args) => {
  const { username, password } = args;
  try {
    const user = await User.findOne({ username });

    if (!user) throw new ApolloError(`User with username ${username} not found`);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new ApolloError('Incorrect password');

    return {
      token: jwt.sign({
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: 60 * 10 }),
    };
  } catch (error) {
    throw error.message;
  }
};

export const createPasswordToken = async (parent, args) => {
  const { email } = args;
  try {
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const currentUser = await User.findOneAndUpdate(
      { email },
      { resetPasswordToken, resetPasswordExpires: Date.now() + 3600000 },
      { new: true } );

    if (!currentUser) throw new ApolloError(`Could not update user with email ${currentUser.email}.`);

    const domain = NODE_ENV === 'development' ? `http://${HOST}:${CLIENT_DEV_PORT}` : CLIENT_HOST;
    const mailOptions = {
      to: currentUser.email,
      from: 'password-reset@lloydntim.com',
      subject: 'Password Reset',
      text: `Please find below the link you have requested to reset your password.
    \n${domain}/reset/${currentUser.resetPasswordToken}\n\n
    If you did not request this email and remember it your password ignore this email.`,
    };
    return await nodemailerMailgun.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  };
};

export const getPasswordToken = async (parent, args) => {
  const { resetPasswordToken } = args;
  const currentUser = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });

  if (!currentUser) throw new ApolloError('Password reset token is invalid or has expired.');
  const { id, username, email } = currentUser;
  const token = jwt.sign({
    id,
    username,
    email,
  }, process.env.JWT_SECRET, { expiresIn: 60 * 10 } );
  return { token };
};

export const updatePassword = async (parents, args) => {
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

    if (!currentUser) throw new ApolloError('Password reset token is invalid or has expired.');
      
    const { id, username, email } = currentUser;
    const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET, { expiresIn: 60 * 10 });
    const mailOptions = {
      to: email,
      from: 'password-reset@lloydntim.com',
      subject: 'Password has been changed',
      text: `Hello,\n\n
      This is a confirmation that the password for your account ${email} has just been changed.\n`,
    };
    nodemailerMailgun.sendMail(mailOptions);
    return {
      token
    };
  } catch (error) {
    throw error.message;
  };
};

export default {
  login,
  register,
  createPasswordToken,
  getPasswordToken,
  updatePassword,
};
