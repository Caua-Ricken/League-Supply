import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCarrinho } from '../../../context/CarrinhoContext';
import {
  FiSearch,
  FiShoppingCart,
  FiClipboard,
  FiChevronDown,
} from 'react-icons/fi';

import './UserHeader.css';

function obterNomeUsuario(): string {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || 'null'
    );

    if (typeof usuario?.nome === 'string') {
      return usuario.nome.trim().split(' ')[0] || 'Usuário';
    }
  } catch {
    return 'Usuário';
  }

  return 'Usuário';
}

const UserHeader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { totalPecas } = useCarrinho();

  const [busca, setBusca] = useState(searchParams.get('busca') ?? '');
  const [menuAberto, setMenuAberto] = useState(false);

  const nome = obterNomeUsuario();

  function pesquisar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const texto = busca.trim();

    if (!texto) {
      navigate('/loja');
      return;
    }

    const parametros = new URLSearchParams({ busca: texto });

    navigate(`/loja?${parametros.toString()}`);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/', { replace: true });
  }

  return (
    <header className="loja-header">
      <div className="loja-header-conteudo">
        <Link
          to="/loja"
          className="loja-header-brand"
          onClick={() => setBusca('')}
          aria-label="League Supply — início"
        >
          LEAGUE<span>★</span>SUPPLY
        </Link>

        <form
          className="loja-header-pesquisa"
          onSubmit={pesquisar}
          role="search"
        >
          <button type="submit" aria-label="Pesquisar produtos">
            <FiSearch aria-hidden="true" />
          </button>

          <input
            type="search"
            aria-label="Buscar produtos, times e ligas"
            placeholder="Buscar produtos, times e ligas..."
            value={busca}
            onChange={event => setBusca(event.target.value)}
          />
        </form>

        <nav className="loja-header-acoes" aria-label="Conta e compras">
          <div className="loja-header-conta">
            <button
              type="button"
              className="loja-header-usuario"
              onClick={() => setMenuAberto(!menuAberto)}
              aria-expanded={menuAberto}
              aria-controls="loja-menu-conta"
            >
              <span className="loja-header-avatar" aria-hidden="true">
                {nome.charAt(0).toUpperCase()}
              </span>

              <span className="loja-header-nome">
                Olá, {nome}
              </span>

              <FiChevronDown aria-hidden="true" />
            </button>

            {menuAberto && (
              <div id="loja-menu-conta" className="loja-header-menu">
                <button type="button" onClick={logout}>
                  Sair da conta
                </button>
              </div>
            )}
          </div>

          <Link to="/loja/pedidos" className="loja-header-link">
            <FiClipboard aria-hidden="true" />
            <span>Meus pedidos</span>
          </Link>

          <Link to="/loja/carrinho" className="loja-header-link">
            <span className="loja-header-carrinho-icone">
              <FiShoppingCart aria-hidden="true" />

              {totalPecas > 0 && (
                <span className="loja-header-contador">
                  {totalPecas}
                </span>
              )}
            </span>

            <span>Carrinho</span>

            <span className="loja-header-sr-only">
              : {totalPecas} peças
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default UserHeader;