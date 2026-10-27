import { NavLink } from 'react-router-dom'

const itens = [
  { to: '.', label: 'Visão geral', icon: '◫', end: true },
  { to: 'produtos', label: 'Produtos', icon: '◇' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: '▤' },
  { to: 'formas-pagamento', label: 'Pagamentos', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9h19M6 15h4" />
    </svg>
  ) },
  { to: 'usuarios', label: 'Usuarios', icon: '◎' },
  { to: 'categorias', label: 'Categorias', icon: '▦' },
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
