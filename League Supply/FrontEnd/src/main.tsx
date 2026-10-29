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
import MainLayoutUser from './layout/MainLayoutUser.tsx';
import Loja from './pages/user/loja/Loja.tsx';
import Carrinho from './pages/user/carrinho/Carrinho.tsx';
import Pagamento from './pages/user/pagamento/Pagamento.tsx'
import Finalizado from './pages/user/finalizado/Finalizado.tsx';
import MeusPedidos from './pages/user/pedido/MeusPedidos.tsx';

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
          },
        ]
      }
    ]
  },
  {
    path: '/loja',
    element: <MainLayoutUser />,
    children: [
        {
          index: true,
          element: <Loja />
        },
        {
          path: 'carrinho',
          element: <Carrinho />
        },
        {
          path: 'pagamento',
          element: <Pagamento />
        },
        {
          path: 'finalizado',
          element: <Finalizado />
        },
        {
          path: 'pedidos',
          element: <MeusPedidos />
        }
    ]
  }
 

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

