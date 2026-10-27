import { useEffect, useState } from 'react';
import UsuarioForm from '../../../components/admin/usuario/UsuarioForm';
import type { Usuario } from '../../../types/Usuario';

import {
  buscarUsuarios,
  excluirUsuario as excluirUsuarioAPI,
} from '../../../services/admin/UsuarioService';

import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const [perfil, setPerfil] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');

  async function carregarUsuarios() {
    setMensagem('');
    setCarregando(true);

    try {
      const dados = await buscarUsuarios();
      setUsuarios(dados);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar usuários.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function novoUsuario() {
    setUsuarioSelecionado(null);
    setOpen(true);
  }

  function editarUsuario(usuario: Usuario) {
    setUsuarioSelecionado(usuario);
    setOpen(true);
  }

  function fecharFormulario() {
    setOpen(false);
    setUsuarioSelecionado(null);
  }

  async function excluirUsuario(usuario: Usuario) {
    if (excluindoId) return;

    if (!window.confirm(`Excluir o usuário "${usuario.nome}"?`)) {
      return;
    }

    setMensagem('');
    setExcluindoId(usuario._id);

    try {
      await excluirUsuarioAPI(usuario._id);
      await carregarUsuarios();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir usuário.'
      );
    } finally {
      setExcluindoId(null);
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario => {
    const texto = busca.trim().toLowerCase();

    const correspondeBusca =
      usuario.nome.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto);

    const correspondePerfil =
      !perfil || usuario.role === perfil;

    return correspondeBusca && correspondePerfil;
  });

  return (
    <section className="usuarios-page">
      <header className="usuarios-cabecalho">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie as contas e permissões da loja.</p>
        </div>

        <button
          type="button"
          className="usuario-botao-principal"
          onClick={novoUsuario}
        >
          + Novo usuário
        </button>
      </header>

      {mensagem && (
        <p className="usuario-erro" role="alert">
          {mensagem}
        </p>
      )}

      <div className="usuarios-painel">
        <div className="usuarios-filtros">
          <input
            type="search"
            aria-label="Buscar por nome ou e-mail"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />

          <select
            aria-label="Filtrar por perfil"
            value={perfil}
            onChange={e => setPerfil(e.target.value)}
          >
            <option value="">Todos os perfis</option>
            <option value="usuario">Usuários</option>
            <option value="admin">Administradores</option>
          </select>
        </div>

        {carregando && (
          <p className="usuarios-aviso" role="status">
            Carregando usuários...
          </p>
        )}

        <ul className="usuarios-lista">
          {usuariosFiltrados.map(usuario => (
            <li key={usuario._id}>
              <div className="usuario-identidade">
                <span className="usuario-inicial" aria-hidden="true">
                  {usuario.nome.charAt(0).toUpperCase()}
                </span>

                <div>
                  <strong>{usuario.nome}</strong>
                  <span>{usuario.email}</span>
                </div>
              </div>

              <span
                className={
                  usuario.role === 'admin'
                    ? 'usuario-perfil usuario-perfil-admin'
                    : 'usuario-perfil'
                }
              >
                {usuario.role === 'admin'
                  ? 'Administrador'
                  : 'Usuário'}
              </span>

              <div className="usuario-item-acoes">
                <button
                  type="button"
                  onClick={() => editarUsuario(usuario)}
                  disabled={excluindoId !== null}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="usuario-excluir"
                  onClick={() => excluirUsuario(usuario)}
                  disabled={excluindoId !== null}
                >
                  {excluindoId === usuario._id
                    ? 'Excluindo...'
                    : 'Excluir'}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {!carregando &&
          !mensagem &&
          usuariosFiltrados.length === 0 && (
            <p className="usuarios-aviso">
              Nenhum usuário encontrado.
            </p>
          )}
      </div>

      {open && (
        <UsuarioForm
          usuario={usuarioSelecionado}
          onFechar={fecharFormulario}
          onAtualizar={carregarUsuarios}
        />
      )}
    </section>
  );
};

export default Usuarios;