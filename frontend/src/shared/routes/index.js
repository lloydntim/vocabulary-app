import {
  UsersPage,
  UserPage,
  VocabListsPage,
  IntroPage,
  AboutPage,
  VocabListPage,
  ResetPasswordPage,
  ForgotPasswordPage,
  SignUpPage,
  VerifyPage,
  LogoutPage,
  LoginPage,
} from '../pages';

const routes = [
  {
    path: '/users',
    name: 'users',
    component: UsersPage,
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserPage,
  },
  {
    path: '/vocablists',
    name: 'vocablists',
    component: VocabListsPage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
  {
    path: '/vocablist/:id',
    name: 'vocablist',
    component: VocabListPage,
  },
  {
    path: '/verify/:token',
    name: 'verify',
    component: VerifyPage,
  },
  {
    path: '/reset/:token',
    name: 'reset',
    component: ResetPasswordPage,
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: ForgotPasswordPage,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpPage,
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutPage,
  },
  {
    path: '/login',
    name: ' login',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'intro',
    component: IntroPage,
  },
];

export default routes;
