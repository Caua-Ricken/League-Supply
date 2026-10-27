import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function obterNomeUsuario(): string {
  try {
    const usuario: unknown = JSON.parse(
      localStorage.getItem('usuario') || 'null'
    );

    if (
      usuario &&
      typeof usuario === 'object' &&
      'nome' in usuario &&
      typeof usuario.nome === 'string' &&
      usuario.nome.trim()
    ) {
      return usuario.nome.trim();
    }
  } catch {
    return 'Administrador';
  }

  return 'Administrador';
}

const AdminHeader = () => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const nome = obterNomeUsuario();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/', { replace: true });
  }

  return (
    <header className="admin-header">
      <Link
        className="admin-brand"
        to="/administrador"
        aria-label="League Supply — início administrativo"
      >
        LEAGUE<span>★</span>SUPPLY
        <small>PAINEL ADMINISTRATIVO</small>
      </Link>

      <div className="admin-account">
        <div>
          <strong>{nome}</strong>
          <small>Administração</small>
        </div>

        <div className="admin-account-menu">
          <button
            type="button"
            className="admin-avatar"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Opções da conta"
            aria-expanded={menuAberto}
          >
            {nome.charAt(0).toUpperCase()}
          </button>

          {menuAberto && (
            <button
              type="button"
              className="admin-logout"
              onClick={logout}
            >
              Sair da conta
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;