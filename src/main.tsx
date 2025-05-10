import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from '@/pages/index.tsx';
import TestGemini from './pages/TestGemini.tsx'; // ← ここを追加

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "/test",          // ← ★ ここが /test で表示されるルート
    element: <TestGemini /> // ← 表示したいコンポーネント
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
