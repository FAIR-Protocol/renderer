import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './root.tsx'
import './index.css'
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Asset from './components/asset.tsx';

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Asset />
      }
    ]    
    // errorElement: <ErrorDisplay />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)