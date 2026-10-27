import { useEffect, useState } from 'react';
import FormaPagamentoForm from '../../../components/admin/formasPagamento/FormaPagamentoForm';
import type {FormaPagamento, TipoPagamento,} from '../../../types/FormaPagamento';
import { buscarFormasPagamento, excluirFormaPagamento,} from '../../../services/admin/FormaPagamentoService';
import './FormasPagamento.css';

const nomesTipos: Record<TipoPagamento, string> = {
  credito: 'Cartão de crédito',
  debito: 'Cartão de débito',
  boleto: 'Boleto',
  pix: 'Pix',
  dinheiro: 'Dinheiro',
};

const FormasPagamento = () => {
  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null);

  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const [situacao, setSituacao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function carregarFormas() {
    setCarregando(true);
    setMensagem('');

    try {
      const dados = await buscarFormasPagamento();
      setFormas(dados);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao buscar formas de pagamento.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFormas();
  }, []);

  function novaForma() {
    setFormaSelecionada(null);
    setOpen(true);
  }

  function editarForma(forma: FormaPagamento) {
    setFormaSelecionada(forma);
    setOpen(true);
  }

  function fecharFormulario() {
    setOpen(false);
    setFormaSelecionada(null);
  }

  async function excluirForma(forma: FormaPagamento) {
    if (excluindo) return;

    if (!window.confirm(`Excluir "${forma.nome}"?`)) return;

    setExcluindo(true);
    setMensagem('');

    try {
      await excluirFormaPagamento(forma._id);
      await carregarFormas();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir forma de pagamento.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  const formasFiltradas = formas.filter(forma => {
    const correspondeNome = forma.nome
      .toLowerCase()
      .includes(busca.trim().toLowerCase());

    const correspondeSituacao =
      situacao === '' ||
      (situacao === 'ativa' ? forma.ativa : !forma.ativa);

    return correspondeNome && correspondeSituacao;
  });

  return (
    <section className="pagamentos-page">
      <header className="pagamentos-cabecalho">
        <div>
          <h1>Formas de pagamento</h1>
          <p>Gerencie as opções e condições aceitas pela loja.</p>
        </div>

        <button
          type="button"
          className="pagamento-botao-principal"
          onClick={novaForma}
        >
          + Nova forma de pagamento
        </button>
      </header>

      {mensagem && (
        <p className="pagamento-erro" role="alert">
          {mensagem}
        </p>
      )}

      <div className="pagamentos-painel">
        <div className="pagamentos-filtros">
          <input
            type="search"
            aria-label="Buscar forma de pagamento"
            placeholder="Buscar forma de pagamento..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />

          <select
            aria-label="Filtrar por situação"
            value={situacao}
            onChange={e => setSituacao(e.target.value)}
          >
            <option value="">Todas as situações</option>
            <option value="ativa">Ativas</option>
            <option value="inativa">Inativas</option>
          </select>
        </div>

        {carregando && (
          <p className="pagamentos-aviso" role="status">
            Carregando formas de pagamento...
          </p>
        )}

        <ul className="pagamentos-lista">
          {formasFiltradas.map(forma => (
            <li key={forma._id}>
              <div className="pagamento-dados">
                <strong>{forma.nome}</strong>

                <span>{nomesTipos[forma.tipo]}</span>

                {forma.tipo === 'credito' && (
                  <small>Até {forma.maxParcelas} parcelas</small>
                )}

                {forma.tipo === 'boleto' && (
                  <small>
                    Vencimento em {forma.prazoVencimentoDias} dias
                  </small>
                )}

                {forma.observacoes && (
                  <p>{forma.observacoes}</p>
                )}
              </div>

              <span
                className={
                  forma.ativa
                    ? 'pagamento-status pagamento-status-ativo'
                    : 'pagamento-status pagamento-status-inativo'
                }
              >
                {forma.ativa ? 'Ativa' : 'Inativa'}
              </span>

              <div className="pagamento-item-acoes">
                <button
                  type="button"
                  onClick={() => editarForma(forma)}
                  disabled={excluindo}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="pagamento-excluir"
                  onClick={() => excluirForma(forma)}
                  disabled={excluindo}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        {!carregando &&
          !mensagem &&
          formasFiltradas.length === 0 && (
            <p className="pagamentos-aviso">
              Nenhuma forma de pagamento encontrada.
            </p>
          )}
      </div>

      {open && (
        <FormaPagamentoForm
          forma={formaSelecionada}
          onFechar={fecharFormulario}
          onAtualizar={carregarFormas}
        />
      )}
    </section>
  );
};

export default FormasPagamento;