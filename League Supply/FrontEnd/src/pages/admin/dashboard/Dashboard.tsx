import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCreditCard,
  FiClipboard,
  FiPackage,
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';

import PedidoDetalhes from '../../../components/user/pedidos/PedidoDetalhes';

import { buscarTodosPedidos } from '../../../services/admin/PedidoService';
import { buscarProdutos } from '../../../services/admin/ProdutoService';
import { buscarUsuarios } from '../../../services/admin/UsuarioService';

import type { PedidoAdmin } from '../../../types/PedidoAdmin';
import type { Produto } from '../../../types/Produto';

import './Dashboard.css';

function formatarPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const Dashboard = () => {
  const [aba, setAba] = useState('geral');

  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const [open, setOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoAdmin | null>(null);

  const [paginaEstoque, setPaginaEstoque] = useState(1);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const [pedidos, produtos, usuarios] = await Promise.all([
          buscarTodosPedidos(),
          buscarProdutos(),
          buscarUsuarios(),
        ]);

        setPedidos(pedidos);
        setProdutos(produtos);
        setTotalUsuarios(usuarios.length);
      } catch {
        setMensagem('Não foi possível carregar a visão geral.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  function abrirDetalhes(pedido: PedidoAdmin) {
    setPedidoSelecionado(pedido);
    setOpen(true);
  }

  function fecharDetalhes() {
    setOpen(false);
    setPedidoSelecionado(null);
  }

  const totalPedidos = pedidos.reduce(
    (total, pedido) => total + pedido.totalCentavos,
    0
  );

  const produtosAtivos = produtos.filter(
    produto => produto.ativo
  );

  // A API já retorna os pedidos do mais recente para o mais antigo.
  const pedidosRecentes = pedidos.slice(0, 3);

  const estoqueBaixo = produtosAtivos.flatMap(produto =>
    produto.variantes
      .filter(variante => variante.estoque <= 3)
      .map(variante => ({
        produtoId: produto._id,
        nome: produto.nome,
        imagemUrl: produto.imagemUrl,
        tamanho: variante.tamanho,
        estoque: variante.estoque,
      }))
  );
  
  estoqueBaixo.sort((a, b) => a.estoque - b.estoque);


  const porPagina = 6;
  const totalPaginasEstoque = Math.max( 1, Math.ceil(estoqueBaixo.length / porPagina));

  const inicioEstoque = (paginaEstoque - 1) * porPagina;

  const estoqueDaPagina = estoqueBaixo.slice(
    inicioEstoque,
    inicioEstoque + porPagina
  );

  return (
    <section className="dashboard-page">
      <header className="dashboard-cabecalho">
        <div>
          <h1>Visão geral</h1>
          <p>Confira os números e os pedidos registrados na loja.</p>
        </div>

        <div className="dashboard-abas">
          <button
            type="button"
            className={aba === 'geral' ? 'selecionada' : ''}
            aria-pressed={aba === 'geral'}
            onClick={() => setAba('geral')}
          >
            <FiClipboard aria-hidden="true" />
            Visão geral
          </button>

          <button
            type="button"
            className={aba === 'estoque' ? 'selecionada' : ''}
            aria-pressed={aba === 'estoque'}
            onClick={() => setAba('estoque')}
          >
            <FiPackage aria-hidden="true" />
            Estoque baixo
          </button>
        </div>
      </header>

      {carregando && (
        <p className="dashboard-estado" role="status">
          Carregando dashboard...
        </p>
      )}

      {mensagem && (
        <p className="dashboard-estado" role="alert">
          {mensagem}
        </p>
      )}

      {!carregando && !mensagem && (
        <>
          {aba === 'geral' && (
            <>
              <div className="dashboard-indicadores">
                <article className="dashboard-indicador">
                  <FiCreditCard aria-hidden="true" />

                  <div>
                    <h2>Total em pedidos</h2>
                    <strong>{formatarPreco(totalPedidos)}</strong>
                    <p>Valor dos pedidos registrados</p>
                  </div>
                </article>

                <article className="dashboard-indicador">
                  <FiClipboard aria-hidden="true" />

                  <div>
                    <h2>Pedidos</h2>
                    <strong>{pedidos.length}</strong>
                    <p>Pedidos registrados na loja</p>
                  </div>
                </article>

                <article className="dashboard-indicador">
                  <FiPackage aria-hidden="true" />

                  <div>
                    <h2>Produtos ativos</h2>
                    <strong>{produtosAtivos.length}</strong>
                    <p>Produtos cadastrados e ativos</p>
                  </div>
                </article>

                <article className="dashboard-indicador">
                  <FiUsers aria-hidden="true" />

                  <div>
                    <h2>Usuários</h2>
                    <strong>{totalUsuarios}</strong>
                    <p>Usuários cadastrados</p>
                  </div>
                </article>
              </div>

              <section className="dashboard-painel">
                <header className="dashboard-painel-cabecalho">
                  <h2>Pedidos recentes</h2>

                  <Link to="/administrador/pedidos">
                    Ver todos
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </header>

                {pedidosRecentes.length === 0 ? (
                  <p className="dashboard-vazio">
                    Nenhum pedido registrado.
                  </p>
                ) : (
                  <div className="dashboard-tabela-container">
                    <table className="dashboard-tabela">
                      <thead>
                        <tr>
                          <th scope="col">Pedido</th>
                          <th scope="col">Cliente</th>
                          <th scope="col">Data</th>
                          <th scope="col">Pagamento</th>
                          <th scope="col">Total</th>
                          <th scope="col">
                            <span className="dashboard-sr-only">
                              Ações
                            </span>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {pedidosRecentes.map(pedido => (
                          <tr key={pedido._id}>
                            <td className="dashboard-numero">
                              <strong>#{pedido.numero}</strong>
                            </td>

                            <td>
                              {pedido.cliente?.nome ??
                                'Usuário excluído'}
                            </td>

                            <td>
                              {new Date(
                                pedido.createdAt
                              ).toLocaleDateString('pt-BR')}
                            </td>

                            <td>
                              {pedido.pagamento}
                              {pedido.parcelas > 1 &&
                                ` · ${pedido.parcelas}x`}
                            </td>

                            <td className="dashboard-valor">
                              <strong>
                                {formatarPreco(
                                  pedido.totalCentavos
                                )}
                              </strong>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="dashboard-ver-detalhes"
                                onClick={() =>
                                  abrirDetalhes(pedido)
                                }
                              >
                                Ver detalhes
                                <FiArrowRight aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="dashboard-painel dashboard-atalhos">
                <h2>Acesso rápido</h2>

                <div>
                  <Link to="/administrador/produtos">
                    <FiPackage aria-hidden="true" />
                    Gerenciar produtos
                  </Link>

                  <Link to="/administrador/pedidos">
                    <FiClipboard aria-hidden="true" />
                    Consultar pedidos
                  </Link>

                  <Link to="/administrador/formas-pagamento">
                    <FiCreditCard aria-hidden="true" />
                    Gerenciar pagamentos
                  </Link>
                </div>
              </section>
            </>
          )}

          {aba === 'estoque' && (
            <section className="dashboard-painel">
              <header className="dashboard-painel-cabecalho">
                <div>
                  <h2>Estoque baixo</h2>
                  <p>
                    Variantes com até 3 unidades, incluindo esgotadas.
                  </p>
                </div>

                <Link to="/administrador/produtos">
                  Gerenciar produtos
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </header>

              {estoqueBaixo.length === 0 ? (
                <p className="dashboard-vazio">
                  Nenhum produto com estoque baixo.
                </p>
              ) : (
                <>
                  <div className="dashboard-estoque-grade">
                    {estoqueDaPagina.map(item => (
                      <article
                        className="dashboard-estoque-item"
                        key={`${item.produtoId}-${item.tamanho}`}
                      >
                        <img
                          src={item.imagemUrl}
                          alt={item.nome}
                        />

                        <div>
                          <h3>{item.nome}</h3>
                          <p>Tamanho: {item.tamanho}</p>
                        </div>

                        <strong>{item.estoque} un.</strong>
                      </article>
                    ))}
                  </div>

                  <footer className="dashboard-estoque-rodape">
                    <span>
                      {estoqueBaixo.length} variante(s) com estoque baixo
                    </span>

                    {totalPaginasEstoque > 1 && (
                      <nav
                        className="dashboard-paginacao"
                        aria-label="Paginação do estoque baixo"
                      >
                        <button
                          type="button"
                          disabled={paginaEstoque === 1}
                          onClick={() =>
                            setPaginaEstoque(paginaEstoque - 1)
                          }
                        >
                          Anterior
                        </button>

                        <span aria-live="polite">
                          {paginaEstoque} de {totalPaginasEstoque}
                        </span>

                        <button
                          type="button"
                          disabled={
                            paginaEstoque === totalPaginasEstoque
                          }
                          onClick={() =>
                            setPaginaEstoque(paginaEstoque + 1)
                          }
                        >
                          Próximo
                        </button>
                      </nav>
                    )}
                  </footer>
                </>
              )}
            </section>
          )}
        </>
      )}

      {open && pedidoSelecionado && (
        <PedidoDetalhes
          pedido={pedidoSelecionado}
          onFechar={fecharDetalhes}
        />
      )}
    </section>
  );
};

export default Dashboard;