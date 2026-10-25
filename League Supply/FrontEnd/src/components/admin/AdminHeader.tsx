function obterNomeUsuario(): string {
  try {
    const usuario: unknown = JSON.parse(localStorage.getItem('usuario') || 'null')
    if (usuario && typeof usuario === 'object' && 'nome' in usuario &&
      typeof usuario.nome === 'string' && usuario.nome.trim()) {
      return usuario.nome.trim()
    }
  } catch {

  }
  return 'Administrador'
}

const AdminHeader = () => {
  const nome = obterNomeUsuario()
  return (
    <header className="admin-header">
      <a className="admin-brand" href="/admin" aria-label="League Supply — início administrativo">
        LEAGUE<span>★</span>SUPPLY
        <small>PAINEL ADMINISTRATIVO</small>
      </a>
      <div className="admin-account">
        <div><strong>{nome}</strong><small>Administração</small></div>
        <span className="admin-avatar" aria-hidden="true">{nome.charAt(0).toUpperCase()}</span>
      </div>
    </header>
  )
}

export default AdminHeader;
