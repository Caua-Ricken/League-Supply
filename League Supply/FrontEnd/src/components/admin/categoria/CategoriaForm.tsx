import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Categoria } from '../../../types/Categotia';
import './CategoriaForm.css';

import {
  cadastrarCategoria,
  editarCategoria,
} from '../../../services/admin/CategotiaService';

interface Props {
  categoria: Categoria | null;
  onFechar: () => void;
  onAtualizar: () => Promise<void>;
}

const CategoriaForm = ({
  categoria,
  onFechar,
  onAtualizar,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [nome, setNome] = useState(categoria?.nome ?? '');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (salvando || !nome.trim()) return;

    setMensagem('');
    setSalvando(true);

    try {
      const dados = { nome: nome.trim() };

      if (categoria) {
        await editarCategoria(categoria._id, dados);
      } else {
        await cadastrarCategoria(dados);
      }
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar categoria.'
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
      className="categoria-modal"
      aria-labelledby="categoria-titulo"
      onCancel={event => {
        event.preventDefault();

        if (!salvando) onFechar();
      }}
    >
      <header className="categoria-modal-cabecalho">
        <h2 id="categoria-titulo">
          {categoria ? 'Editar categoria' : 'Nova categoria'}
        </h2>

        <button
          type="button"
          className="categoria-fechar"
          onClick={onFechar}
          disabled={salvando}
          aria-label="Fechar"
        >
          ×
        </button>
      </header>

      <form onSubmit={salvar}>
        {mensagem && (
          <p className="categoria-erro" role="alert">
            {mensagem}
          </p>
        )}

        <label htmlFor="categoria-nome">
          Nome da categoria
        </label>

        <input
          id="categoria-nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex.: Bonés"
          maxLength={60}
          required
          pattern=".*\S.*"
          disabled={salvando}
          autoFocus
        />

        <p className="categoria-ajuda">
          Use a categoria para organizar os produtos da loja.
        </p>

        <div className="categoria-modal-acoes">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="categoria-botao-principal"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar categoria'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default CategoriaForm;