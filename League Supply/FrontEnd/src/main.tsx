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
import Admin from './routes/admin/Admin.tsx'
import Categorias from './pages/admin/categoria/Categoria.tsx';
import Usuarios from './pages/admin/usuario/Usuarios.tsx';
import FormasPagamento from './pages/admin/formaPagamento/FormasPagamento.tsx';

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
    element: <Admin />,
    children: [
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
          },
          {
            path: 'categorias',
            element: <Categorias />
          },
          {
            path: 'usuarios',
            element: <Usuarios />
          },
          {
            path: 'formas-pagamento',
            element: <FormasPagamento />
          }
        ]
      }
    ]
  },
 

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
