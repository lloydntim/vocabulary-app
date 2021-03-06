// ./routes/index.js
import MainPage from './MainPage';
import AnotherPage from './AnotherPage';

const routes = [
  {
    path: '/another',
    name: 'home',
    exact: true,
    component: MainPage,
  },
  {
    path: '/',
    name: 'another',
    component: AnotherPage,
  },
];

export default routes;
