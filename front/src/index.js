import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Navigate, RouterProvider } from 'react-router';

import { createBrowserRouter } from 'react-router-dom';
import Login from './screen/login';
import Edit from './screen/edit';
import Tabel from './screen/tabel';
import AddData from './screen/addData';
import Profile from './screen/profile';
import Logout from './screen/logout';
import Error from './screen/error';
import Forget from './screen/forget';
import { GoogleOAuthProvider } from '@react-oauth/google';

const IsNotAuthenticated = ( {children}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};




const router = createBrowserRouter([
  { path: '/', element:   <Login />} ,
    { path: '/tabel', element:  <IsNotAuthenticated> <Tabel /> </IsNotAuthenticated>},
    { path : '/edit/:id', element:  <IsNotAuthenticated>  <Edit /></IsNotAuthenticated> },
     {path: '/add', element: <IsNotAuthenticated><AddData /> </IsNotAuthenticated> },
      { path: '/profile', element:  <IsNotAuthenticated> <Profile /> </IsNotAuthenticated> },
      { path: '/forget', element: <Forget />},
       { path: '/logout', element: <Logout />},
    { path: '*', element: <Error /> },
  ])

 



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId="136267858721-d9gvienjq41td6q817b2gdtvc6inlo0o.apps.googleusercontent.com">
    <RouterProvider router={router}/>
  </GoogleOAuthProvider>
  </React.StrictMode>
);
reportWebVitals();
