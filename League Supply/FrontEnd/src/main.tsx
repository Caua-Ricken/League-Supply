import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

import Login from './pages/login/Login.tsx';
import CadastrarUsuario from './pages/cadastroUsuario/CadastrarUsuario.tsx'
import MainLayoutAdmin from './layout/MainLayoutAdmin.tsx';
import Dashboard from './pages/admin/dashboard/Dashboard.tsx';
import Produtos from './pages/admin/produtos/Produtos.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <CadastrarUsuario />
  },
  {
    path: '/administrador',
    element: <MainLayoutAdmin />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'produtos',
        element: <Produtos />
      }
    ]
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
