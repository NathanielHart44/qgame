import { Navigate, useRoutes } from 'react-router-dom';
import { PATH_AFTER_LOGIN } from 'src/config';
// pages
import NotFound from 'src/pages/NotFound';
import Home from 'src/pages/Home';
import Login from 'src/pages/Login';
import Register from 'src/pages/Register';
import GuestGuard from 'src/guards/GuestGuard';
import AuthGuard from 'src/guards/AuthGuard';
import NavBar from 'src/components/NavBar';
import { useContext } from 'react';
import MainGame from 'src/pages/MainGame';

// ----------------------------------------------------------------------

function withAuthGuard(element: JSX.Element) { return <AuthGuard>{element}</AuthGuard> };
function withGuestGuard(element: JSX.Element) { return <GuestGuard>{element}</GuestGuard> }

export default function Router() {

  return useRoutes([
    {
      path: 'auth',
      children: [
        { path: 'login', element: withGuestGuard(<Login />) },
        { path: 'register', element: withGuestGuard(<Register />) },
      ],
    },
    {
      path: '',
      children: [
        { element: withAuthGuard(<Navigate to={PATH_AFTER_LOGIN} replace />), index: true },
        { path: 'home', element: withGuestGuard(<Home />) },
        // { path: 'game/:gameID', element: withAuthGuard(<MainGame />) },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      children: [
        { element: <Navigate to="/home" replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
