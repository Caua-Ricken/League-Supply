import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  Usuario,
  UsuarioInput,
} from '../../../types/Usuario';

import {
  cadastrarUsuario,
  editarUsuario,
} from '../../../services/admin/UsuarioService';

import './UsuarioForm.css';

interface Props {
  usuario: Usuario | null;
  onFechar: () => void;
  onAtualizar: () => Promise<void>;
}

const UsuarioForm = ({ usuario, onFechar, onAtualizar,}: Props) => {

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [role, setRole] = useState(usuario?.role ?? 'usuario');
  const [senha, setSenha] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (salvando) return;

    if (!nome.trim()) {
      setMensagem('Informe o nome do usuário.');
      return;
    }

    const dados: UsuarioInput = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      role,
    };

    if (senha !== '') {
      dados.senha = senha;
    }

    setMensagem('');
    setSalvando(true);

    try {
      if (usuario) {
        await editarUsuario(usuario._id, dados);
      } else {
        await cadastrarUsuario(dados);
      }
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar usuário.'
      );

      setSalvando(false);
      return;
    }

    try {
      await onAtualizar();
    } finally {
      setSalvando(false);
      onFechar();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="usuario-modal"
      aria-labelledby="usuario-form-titulo"
      onCancel={event => {
        event.preventDefault();

        if (!salvando) onFechar();
      }}
    >
      <header className="usuario-modal-cabecalho">
        <div>
          <h2 id="usuario-form-titulo">
            {usuario ? 'Editar usuário' : 'Novo usuário'}
          </h2>

          <p>Preencha os dados da conta.</p>
        </div>

        <button
          type="button"
          className="usuario-fechar"
          onClick={onFechar}
          disabled={salvando}
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </header>

      <form className="usuario-form" onSubmit={salvar}>
        {mensagem && (
          <p className="usuario-erro" role="alert">
            {mensagem}
          </p>
        )}

        <label>
          Nome
          <input
            value={nome}
            onChange={event => setNome(event.target.value)}
            placeholder="Nome completo"
            required
            pattern=".*\S.*"
            disabled={salvando}
            autoFocus
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="usuario@email.com"
            required
            disabled={salvando}
          />
        </label>

        <label>
          Perfil
          <select
            value={role}
            onChange={event => {
              const valor = event.target.value;

              if (valor === 'usuario' || valor === 'admin') {
                setRole(valor);
              }
            }}
            disabled={salvando}
          >
            <option value="usuario">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </label>

        <label>
          {usuario ? 'Nova senha' : 'Senha'}
          <input
            type="password"
            value={senha}
            onChange={event => setSenha(event.target.value)}
            placeholder={
              usuario
                ? 'Deixe vazio para manter a senha atual'
                : 'Pelo menos 6 caracteres'
            }
            minLength={6}
            required={!usuario}
            autoComplete="new-password"
            disabled={salvando}
          />
        </label>

        {usuario && (
          <p className="usuario-ajuda">
            Preencha a senha somente se desejar alterá-la.
          </p>
        )}

        <div className="usuario-form-acoes">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="usuario-botao-principal"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar usuário'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default UsuarioForm;