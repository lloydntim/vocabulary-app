import {
  MainPage,
  VocabListPage,
  AboutPage,
  SignUpPage,
  LoginPage,
  LogoutPage,
  UsersPage,
  UserPage,
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
    path: '/home',
    name: 'home',
    component: MainPage,
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
    path: '/',
    name: ' login',
    component: LoginPage,
  },
];

export default routes;
