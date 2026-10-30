import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiSearch } from 'react-icons/fi';

import PedidoDetalhes from '../../../components/user/pedidos/PedidoDetalhes';
import { buscarTodosPedidos } from '../../../services/admin/PedidoService';

import type { PedidoAdmin } from '../../../types/PedidoAdmin';

import './Pedidos.css';

function formatarPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const [busca, setBusca] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [pagina, setPagina] = useState(1);

  const [open, setOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoAdmin | null>(null);

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const dados = await buscarTodosPedidos();
        console.log(dados)
        setPedidos(dados);
      } catch {
        setMensagem('Não foi possível carregar os pedidos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, []);

  function limparFiltros() {
    setBusca('');
    setDataInicial('');
    setDataFinal('');
    setPagina(1);
  }

  function abrirDetalhes(pedido: PedidoAdmin) {
    setPedidoSelecionado(pedido);
    setOpen(true);
  }

  function fecharDetalhes() {
    setOpen(false);
    setPedidoSelecionado(null);
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    const texto = [
      pedido.numero,
      pedido.cliente?.nome ?? '',
      pedido.cliente?.email ?? '',
    ].join(' ').toLowerCase();

    const correspondeBusca = texto.includes(
      busca.trim().replace(/^#/, '').toLowerCase()
    );

    const dataPedido = new Date(pedido.createdAt);

    const correspondeInicio =
      !dataInicial ||
      dataPedido >= new Date(`${dataInicial}T00:00:00`);

    const correspondeFim =
      !dataFinal ||
      dataPedido <= new Date(`${dataFinal}T23:59:59.999`);

    return correspondeBusca && correspondeInicio && correspondeFim;
  });

  const porPagina = 6;

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / porPagina));

  const inicio = (pagina - 1) * porPagina;

  const pedidosDaPagina = pedidosFiltrados.slice( inicio, inicio + porPagina);

  return (
    <section className="admin-pedidos-page">
      <header className="admin-pedidos-cabecalho">
        <h1>Pedidos</h1>
        <p>Consulte os pedidos e os dados das compras da loja.</p>
      </header>

      <div className="admin-pedidos-painel">
        <div className="admin-pedidos-filtros">
          <div className="admin-pedidos-busca">
            <FiSearch aria-hidden="true" />

            <input
              type="search"
              aria-label="Buscar por número ou cliente"
              placeholder="Buscar por número ou cliente..."
              value={busca}
              onChange={e => {
                setBusca(e.target.value);
                setPagina(1);
              }}
            />
          </div>

          <label>
            Data inicial
            <input
              type="date"
              value={dataInicial}
              max={dataFinal || undefined}
              onChange={e => {
                setDataInicial(e.target.value);
                setPagina(1);
              }}
            />
          </label>

          <label>
            Data final
            <input
              type="date"
              value={dataFinal}
              min={dataInicial || undefined}
              onChange={e => {
                setDataFinal(e.target.value);
                setPagina(1);
              }}
            />
          </label>

          <button
            type="button"
            className="admin-pedidos-limpar"
            onClick={limparFiltros}
          >
            Limpar filtros
          </button>
        </div>

        {carregando && (
          <p className="admin-pedidos-estado" role="status">
            Carregando pedidos...
          </p>
        )}

        {mensagem && (
          <p className="admin-pedidos-estado" role="alert">
            {mensagem}
          </p>
        )}

        {!carregando && !mensagem && (
          <>
            <p className="admin-pedidos-contagem">
              {pedidosFiltrados.length} pedido(s) encontrado(s)
            </p>

            <div className="admin-pedidos-tabela-container">
              <table className="admin-pedidos-tabela">
                <thead>
                  <tr>
                    <th scope="col">Pedido</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Data</th>
                    <th scope="col">Pagamento</th>
                    <th scope="col">Itens</th>
                    <th scope="col">Total</th>
                    <th scope="col">
                      <span className="admin-pedidos-sr-only">
                        Ações
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedidosDaPagina.map(pedido => (
                    <tr key={pedido._id}>
                      <td className="admin-pedidos-numero">
                        <strong>#{pedido.numero}</strong>
                      </td>

                      <td>
                        <div className="admin-pedidos-cliente">
                          <strong>
                            {pedido.cliente?.nome ?? 'Usuário excluído'}
                          </strong>

                          <span>
                            {pedido.cliente?.email ?? '—'}
                          </span>
                        </div>
                      </td>

                      <td>
                        {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                      </td>

                      <td>
                        {pedido.pagamento}
                        {pedido.parcelas > 1 && ` · ${pedido.parcelas}x`}
                      </td>

                      <td>
                        {pedido.itens.reduce(
                          (total, item) => total + item.quantidade,
                          0
                        )}{' '}
                        peça(s)
                      </td>

                      <td className="admin-pedidos-valor">
                        <strong>
                          {formatarPreco(pedido.totalCentavos)}
                        </strong>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-pedidos-detalhes"
                          onClick={() => abrirDetalhes(pedido)}
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

            {pedidosFiltrados.length === 0 && (
              <p className="admin-pedidos-estado">
                Nenhum pedido encontrado.
              </p>
            )}

            {pedidosFiltrados.length > 0 && (
              <footer className="admin-pedidos-rodape">
                <span>
                  Mostrando {inicio + 1}–
                  {Math.min(inicio + porPagina, pedidosFiltrados.length)}
                  {' '}de {pedidosFiltrados.length} pedidos
                </span>

                <nav
                  className="admin-pedidos-paginacao"
                  aria-label="Paginação dos pedidos"
                >
                  <button
                    type="button"
                    disabled={pagina === 1}
                    onClick={() => setPagina(pagina - 1)}
                  >
                    Anterior
                  </button>

                  <span aria-live="polite">
                    {pagina} de {totalPaginas}
                  </span>

                  <button
                    type="button"
                    disabled={pagina === totalPaginas}
                    onClick={() => setPagina(pagina + 1)}
                  >
                    Próximo
                  </button>
                </nav>
              </footer>
            )}
          </>
        )}
      </div>

      <Link
        to="/administrador"
        className="admin-pedidos-voltar"
      >
        <FiArrowLeft aria-hidden="true" />
        Voltar à visão geral
      </Link>

      {open && pedidoSelecionado && (
        <PedidoDetalhes
          pedido={pedidoSelecionado}
          onFechar={fecharDetalhes}
        />
      )}
    </section>
  );
};

export default Pedidos;