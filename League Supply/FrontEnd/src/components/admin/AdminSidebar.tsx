import { NavLink } from 'react-router-dom'

const itens = [
  { to: '.', label: 'Visão geral', icon: '◫', end: true },
  { to: 'produtos', label: 'Produtos', icon: '◇' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: '▤' },
  { to: '/admin/clientes', label: 'Clientes', icon: '◎' },
  { to: '/admin/categorias', label: 'Categorias', icon: '▦' },
]

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <p className="admin-nav-label">GESTÃO DA LOJA</p>
      <nav aria-label="Navegação administrativa">
        {itens.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `admin-nav-item${isActive ? ' is-active' : ''}`}>
            <span aria-hidden="true">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-note"><span>BUILT FOR FANS</span><strong>O jogo começa<br />nos bastidores.</strong><small>LEAGUE SUPPLY / EST. 2026</small></div>
    </aside>
  )
}

export default AdminSidebar;
