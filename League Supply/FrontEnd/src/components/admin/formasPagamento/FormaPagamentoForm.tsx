import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { FormaPagamento, FormaPagamentoInput, TipoPagamento, } from '../../../types/FormaPagamento';
import { cadastrarFormaPagamento, editarFormaPagamento, } from '../../../services/admin/FormaPagamentoService';
import './FormaPagamentoForm.css';

interface Props {
  forma: FormaPagamento | null;
  onFechar: () => void;
  onAtualizar: () => Promise<void>;
}

const FormaPagamentoForm = ({ forma, onFechar, onAtualizar, }: Props) => {

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [nome, setNome] = useState(forma?.nome ?? '');
  const [tipo, setTipo] = useState<TipoPagamento>(
    forma?.tipo ?? 'pix'
  );

  const [ativa, setAtiva] = useState(forma?.ativa ?? true);

  const [maxParcelas, setMaxParcelas] = useState(
    String(forma?.maxParcelas ?? 1)
  );

  const [prazoVencimentoDias, setPrazoVencimentoDias] = useState(
    String(forma?.prazoVencimentoDias ?? 7)
  );

  const [observacoes, setObservacoes] = useState(
    forma?.observacoes ?? ''
  );

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

    setMensagem('');

    if (!nome.trim()) {
      setMensagem('Informe o nome da forma de pagamento.');
      return;
    }

    const dados: FormaPagamentoInput = {
      nome: nome.trim(),
      tipo,
      ativa,
      observacoes: observacoes.trim(),
    };

    if (tipo === 'credito') {
      const parcelas = Number(maxParcelas);

      if (!Number.isSafeInteger(parcelas) || parcelas < 1) {
        setMensagem('Informe uma quantidade válida de parcelas.');
        return;
      }

      dados.maxParcelas = parcelas;
    }

    if (tipo === 'boleto') {
      const dias = Number(prazoVencimentoDias);

      if (!Number.isSafeInteger(dias) || dias < 1) {
        setMensagem('Informe uma quantidade válida de dias.');
        return;
      }

      dados.prazoVencimentoDias = dias;
    }

    setSalvando(true);

    try {
      if (forma) {
        await editarFormaPagamento(forma._id, dados);
      } else {
        await cadastrarFormaPagamento(dados);
      }
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar forma de pagamento.'
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
      className="pagamento-modal"
      aria-labelledby="pagamento-titulo"
      onCancel={event => {
        event.preventDefault();

        if (!salvando) onFechar();
      }}
    >
      <header className="pagamento-modal-cabecalho">
        <h2 id="pagamento-titulo">
          {forma ? 'Editar forma de pagamento' : 'Nova forma de pagamento'}
        </h2>

        <button
          type="button"
          className="pagamento-fechar"
          onClick={onFechar}
          disabled={salvando}
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </header>

      <form className="pagamento-form" onSubmit={salvar}>
        {mensagem && (
          <p className="pagamento-erro" role="alert">
            {mensagem}
          </p>
        )}

        <label>
          Nome
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex.: Cartão de crédito"
            required
            maxLength={60}
            pattern=".*\S.*"
            disabled={salvando}
            autoFocus
          />
        </label>

        <div className="pagamento-form-linha">
          <label>
            Tipo
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value as TipoPagamento)}
              disabled={salvando}
            >
              <option value="pix">Pix</option>
              <option value="credito">Cartão de crédito</option>
              <option value="debito">Cartão de débito</option>
              <option value="boleto">Boleto</option>
              <option value="dinheiro">Dinheiro</option>
            </select>
          </label>

          <label>
            Situação
            <select
              value={ativa ? 'ativa' : 'inativa'}
              onChange={e =>
                setAtiva(e.target.value === 'ativa')
              }
              disabled={salvando}
            >
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </label>
        </div>

        {tipo === 'credito' && (
          <label>
            Máximo de parcelas
            <input
              type="number"
              min="1"
              step="1"
              value={maxParcelas}
              onChange={e => setMaxParcelas(e.target.value)}
              required
              disabled={salvando}
            />
          </label>
        )}

        {tipo === 'boleto' && (
          <label>
            Prazo de vencimento em dias
            <input
              type="number"
              min="1"
              step="1"
              value={prazoVencimentoDias}
              onChange={e =>
                setPrazoVencimentoDias(e.target.value)
              }
              required
              disabled={salvando}
            />
          </label>
        )}

        <label>
          Observações
          <textarea
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Condições adicionais, se houver."
            maxLength={500}
            rows={3}
            disabled={salvando}
          />
        </label>

        <div className="pagamento-form-acoes">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="pagamento-botao-principal"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default FormaPagamentoForm;