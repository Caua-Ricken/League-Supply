import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';

import CheckoutEtapas from '../../../components/user/checkout/CheckoutEtapas';
import { buscarProdutos } from '../../../services/admin/ProdutoService';
import { useCarrinho } from '../../../context/CarrinhoContext';

import type { Produto } from '../../../types/Produto';
import times from '../../../data/times.json';
import './Carrinho.css';

function formatarPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const Carrinho = () => {
  const navigate = useNavigate();

  const {
    itens,
    totalPecas,
    alterarQuantidade,
    remover,
  } = useCarrinho();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await buscarProdutos();
        setProdutos(dados);
      } catch {
        setErro('Não foi possível carregar os produtos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  function alterar(
    produto: Produto,
    tamanho: string,
    quantidade: number
  ) {
    try {
      alterarQuantidade(produto, tamanho, quantidade);
      setMensagem('');
    } catch {
      setMensagem('Não foi possível alterar a quantidade.');
    }
  }

  function excluir(produtoId: string, tamanho: string) {
    try {
      remover(produtoId, tamanho);
      setMensagem('');
    } catch {
      setMensagem('Não foi possível remover o produto.');
    }
  }

  const lista = itens.map(item => {
    const produto = produtos.find(
      produto => produto._id === item.produtoId
    );

    const variante = produto?.variantes.find(
      variante => variante.tamanho === item.tamanho
    );

    const estoque = variante?.estoque ?? 0;
    const disponivel = Boolean(produto?.ativo && estoque > 0);

    return {
      ...item,
      produto,
      estoque,
      disponivel,
      valido: disponivel && item.quantidade <= estoque,
      subtotal: (produto?.precoCentavos ?? 0) * item.quantidade,
    };
  });

  const total = lista.reduce(
    (soma, item) => soma + item.subtotal,
    0
  );

  return (
    <section className="carrinho-page">
      <CheckoutEtapas etapa={1} />

      <header className="carrinho-cabecalho">
        <h1>Meu carrinho</h1>
        <p>Confira seus produtos e avance para o pagamento.</p>
      </header>

      {mensagem && (
        <p className="carrinho-mensagem" role="alert">
          {mensagem}
        </p>
      )}

      {carregando && (
        <p className="carrinho-estado" role="status">
          Carregando carrinho...
        </p>
      )}

      {erro && (
        <p className="carrinho-mensagem" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && itens.length === 0 && (
        <div className="carrinho-vazio">
          <h2>Seu carrinho está vazio</h2>
          <p>Explore a loja e escolha os artigos dos seus times.</p>
          <Link to="/loja">Continuar comprando</Link>
        </div>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <div className="carrinho-layout">
          <div>
            <div className="carrinho-lista-painel">
              <h2>
                {itens.length} itens
                <span> ({totalPecas} peças no total)</span>
              </h2>

              <ul className="carrinho-lista">
                {lista.map(item => {
                  const produto = item.produto;

                  const time = times.find(
                    time => time.id === produto?.timeId
                  );

                  return (
                    <li key={`${item.produtoId}-${item.tamanho}`}>
                      <div className="carrinho-produto">
                        {produto ? (
                          <img
                            className="carrinho-produto-foto"
                            src={produto.imagemUrl}
                            alt={produto.nome}
                          />
                        ) : (
                          <div className="carrinho-sem-foto">—</div>
                        )}

                        <div className="carrinho-produto-dados">
                          {produto && (
                            <div className="carrinho-time">
                              {time && (
                                <img src={time.logoUrl} alt="" />
                              )}
                              <span>{produto.liga}</span>
                            </div>
                          )}

                          <h3>
                            {produto?.nome ?? 'Produto indisponível'}
                          </h3>

                          <span>Tamanho: {item.tamanho}</span>

                          <small
                            className={
                              item.valido
                                ? 'carrinho-estoque-ok'
                                : 'carrinho-estoque-erro'
                            }
                          >
                            {item.valido
                              ? `${item.estoque} peças disponíveis`
                              : 'Ajuste a quantidade ou remova este item.'}
                          </small>
                        </div>
                      </div>

                      <div className="carrinho-valor">
                        <span>Preço unitário</span>
                        <strong>
                          {produto
                            ? formatarPreco(produto.precoCentavos)
                            : '—'}
                        </strong>
                      </div>

                      <div className="carrinho-quantidade">
                        <span>Quantidade</span>

                        <div className="carrinho-quantidade-controle">
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            disabled={
                              !item.disponivel || item.quantidade <= 1
                            }
                            onClick={() => {
                              if (produto) {
                                alterar(
                                  produto,
                                  item.tamanho,
                                  Math.min(
                                    item.quantidade - 1,
                                  )
                                );
                              }
                            }}
                          >
                            <FiMinus aria-hidden="true" />
                          </button>

                          <output aria-live="polite">
                            {item.quantidade}
                          </output>

                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            disabled={
                              !item.disponivel ||
                              item.quantidade >= item.estoque
                            }
                            onClick={() => {
                              if (produto) {
                                alterar(
                                  produto,
                                  item.tamanho,
                                  item.quantidade + 1
                                );
                              }
                            }}
                          >
                            <FiPlus aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="carrinho-valor">
                        <span>Subtotal</span>
                        <strong>
                          {produto
                            ? formatarPreco(item.subtotal)
                            : '—'}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="carrinho-remover"
                        onClick={() =>
                          excluir(item.produtoId, item.tamanho)
                        }
                      >
                        <FiTrash2 aria-hidden="true" />
                        Remover
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link to="/loja" className="carrinho-continuar">
              <FiArrowLeft aria-hidden="true" />
              Continuar comprando
            </Link>
          </div>

          <aside className="carrinho-resumo">
            <h2>Resumo do pedido</h2>

            <div className="carrinho-resumo-linha">
              <span>Subtotal ({totalPecas} peças)</span>
              <strong>{formatarPreco(total)}</strong>
            </div>

            <div className="carrinho-resumo-linha">
              <span>Frete</span>
              <span>A calcular</span>
            </div>

            <div className="carrinho-resumo-total">
              <strong>Total dos produtos</strong>
              <strong>{formatarPreco(total)}</strong>
            </div>

            <button
              type="button"
              className="carrinho-finalizar"
              disabled={lista.some(item => !item.valido)}
              onClick={() => navigate('/loja/pagamento')}
            >
              Ir para pagamento
              <FiArrowRight aria-hidden="true" />
            </button>

            <p className="carrinho-resumo-ajuda">
              Escolha a forma de pagamento na próxima etapa.
              O estoque será conferido novamente ao finalizar o pedido.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Carrinho;