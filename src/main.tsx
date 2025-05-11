import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Home from './pages/Home.tsx';
import Input from './pages/Input.tsx';
import Chat from './pages/Chat.tsx';
import Answer from './pages/Answer.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/input',
    element: <Input />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/answer',
    element: <Answer />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
