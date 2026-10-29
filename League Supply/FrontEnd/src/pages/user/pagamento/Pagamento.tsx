import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCreditCard,
} from 'react-icons/fi';

import CheckoutEtapas from '../../../components/user/checkout/CheckoutEtapas';
import { useCarrinho } from '../../../context/CarrinhoContext';

import { buscarProdutos } from '../../../services/admin/ProdutoService';
import { buscarFormasPagamento } from '../../../services/admin/FormaPagamentoService';
import { cadastrarPedido } from '../../../services/user/PedidoService';

import type { Produto } from '../../../types/Produto';
import './Pagamento.css';

interface FormaPagamento {
  _id: string;
  nome: string;
  tipo: string;
  ativa: boolean;
  maxParcelas?: number;
  prazoVencimentoDias?: number;
  observacoes?: string;
}

function formatarPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const Pagamento = () => {
  const navigate = useNavigate();
  const { itens, totalPecas, limpar } = useCarrinho();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [formaId, setFormaId] = useState('');
  const [parcelas, setParcelas] = useState(1);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const [produtos, formas] = await Promise.all([
          buscarProdutos(),
          buscarFormasPagamento(),
        ]);

        setProdutos(produtos);
        setFormas(formas.filter(forma => forma.ativa));
      } catch {
        setErro('Não foi possível carregar o pagamento.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const formaSelecionada = formas.find(
    forma => forma._id === formaId
  );

  const lista = itens.map(item => {
    const produto = produtos.find(
      produto => produto._id === item.produtoId
    );

    return {
      ...item,
      produto,
      subtotal: (produto?.precoCentavos ?? 0) * item.quantidade,
    };
  });

  const total = lista.reduce(
    (soma, item) => soma + item.subtotal,
    0
  );

  function selecionarForma(id: string) {
    setFormaId(id);
    setParcelas(1);
    setMensagem('');
  }

  async function finalizarPedido() {
    if (salvando) return;

    if (!formaSelecionada || itens.length === 0) {
      setMensagem('Confira o carrinho e selecione o pagamento.');
      return;
    }

    setSalvando(true);
    setMensagem('');

    try {
      const pedido = await cadastrarPedido({
        itens,
        formaPagamentoId: formaId,
        parcelas:
          formaSelecionada.tipo === 'credito' ? parcelas : 1,
      });

      limpar();

      navigate('/loja/finalizado', {
        replace: true,
        state: { pedido },
      });
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Não foi possível finalizar o pedido.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="pagamento-page">
      <CheckoutEtapas etapa={2} />

      <header className="pagamento-cabecalho">
        <h1>Pagamento</h1>
        <p>Escolha como deseja pagar seu pedido.</p>
      </header>

      {mensagem && (
        <p className="pagamento-aviso" role="alert">
          {mensagem}
        </p>
      )}

      {carregando && (
        <p className="pagamento-estado" role="status">
          Carregando pagamento...
        </p>
      )}

      {erro && (
        <p className="pagamento-aviso" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && itens.length === 0 && (
        <div className="pagamento-estado">
          <p>Seu carrinho está vazio.</p>
          <Link to="/loja">Voltar para a loja</Link>
        </div>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <>
          <div className="pagamento-layout">
            <div className="pagamento-formas">
              <h2>Forma de pagamento</h2>

              {formas.length === 0 && (
                <p className="pagamento-sem-formas">
                  Nenhuma forma de pagamento disponível.
                </p>
              )}

              {formas.map(forma => (
                <div
                  key={forma._id}
                  className={
                    formaId === forma._id
                      ? 'pagamento-opcao selecionada'
                      : 'pagamento-opcao'
                  }
                >
                  <label className="pagamento-opcao-titulo">
                    <input
                      type="radio"
                      name="formaPagamento"
                      checked={formaId === forma._id}
                      onChange={() => selecionarForma(forma._id)}
                      disabled={salvando}
                    />

                    <FiCreditCard aria-hidden="true" />

                    <span>
                      <strong>{forma.nome}</strong>

                      {forma.tipo === 'boleto' && (
                        <small>
                          Vencimento em {forma.prazoVencimentoDias} dias
                        </small>
                      )}

                      {forma.tipo === 'pix' && (
                        <small>Pagamento à vista</small>
                      )}
                    </span>
                  </label>

                  {formaId === forma._id &&
                    forma.tipo === 'credito' && (
                      <div className="pagamento-parcelas">
                        <label htmlFor="parcelas">Parcelas</label>

                        <select
                          id="parcelas"
                          value={parcelas}
                          onChange={event =>
                            setParcelas(Number(event.target.value))
                          }
                          disabled={salvando}
                        >
                          {Array.from(
                            { length: forma.maxParcelas || 1 },
                            (_, indice) => {
                              const numero = indice + 1;

                              return (
                                <option key={numero} value={numero}>
                                  {numero}x de{' '}
                                  {formatarPreco(total / numero)}
                                </option>
                              );
                            }
                          )}
                        </select>

                        <small>
                          Até {forma.maxParcelas || 1} parcelas
                        </small>
                      </div>
                    )}
                </div>
              ))}

              {formaSelecionada?.observacoes && (
                <div className="pagamento-condicoes">
                  <strong>Condições</strong>
                  <p>{formaSelecionada.observacoes}</p>
                </div>
              )}
            </div>

            <aside className="pagamento-resumo">
              <h2>Resumo do pedido</h2>

              <div className="pagamento-produtos">
                {lista.map(item => (
                  <div
                    className="pagamento-produto"
                    key={`${item.produtoId}-${item.tamanho}`}
                  >
                    {item.produto && (
                      <img
                        src={item.produto.imagemUrl}
                        alt={item.produto.nome}
                      />
                    )}

                    <div>
                      <h3>
                        {item.produto?.nome ?? 'Produto indisponível'}
                      </h3>

                      <p>
                        {item.tamanho} · {item.quantidade} unidade(s)
                      </p>
                    </div>

                    <strong>
                      {item.produto
                        ? formatarPreco(item.subtotal)
                        : '—'}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="pagamento-resumo-linha">
                <span>Subtotal ({totalPecas} peças)</span>
                <strong>{formatarPreco(total)}</strong>
              </div>

              <div className="pagamento-total">
                <strong>Total dos produtos</strong>
                <strong>{formatarPreco(total)}</strong>
              </div>

              <button
                type="button"
                className="pagamento-finalizar"
                onClick={finalizarPedido}
                disabled={
                  salvando ||
                  !formaId ||
                  lista.some(item => !item.produto)
                }
              >
                {salvando ? 'Finalizando...' : 'Finalizar pedido'}
                <FiArrowRight aria-hidden="true" />
              </button>

              <p className="pagamento-ajuda">
                O pedido será registrado com a forma de
                pagamento selecionada.
              </p>
            </aside>
          </div>

          <Link
            to="/loja/carrinho"
            className="pagamento-voltar"
          >
            <FiArrowLeft aria-hidden="true" />
            Voltar ao carrinho
          </Link>
        </>
      )}
    </section>
  );
};

export default Pagamento;