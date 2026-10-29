import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiSearch } from 'react-icons/fi';

import PedidoDetalhes from '../../../components/user/pedidos/PedidoDetalhes';
import { buscarMeusPedidos } from '../../../services/user/PedidoService';

import type { Pedido } from '../../../types/Pedido';

import './MeusPedidos.css';

function formatarPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const MeusPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const [open, setOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const dados = await buscarMeusPedidos();
        setPedidos(dados);
      } catch {
        setMensagem('Não foi possível carregar seus pedidos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, []);

  console.log(pedidos)

  function abrirDetalhes(pedido: Pedido) {
    setPedidoSelecionado(pedido);
    setOpen(true);
  }

  function fecharDetalhes() {
    setOpen(false);
    setPedidoSelecionado(null);
  }

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.numero.toLowerCase().includes(
      busca.trim().replace(/^#/, '').toLowerCase()
    )
  );

  return (
    <section className="pedidos-page">
      <nav className="pedidos-caminho" aria-label="Localização">
        <Link to="/loja">Loja</Link>
        <span>/</span>
        <span>Meus pedidos</span>
      </nav>

      <header className="pedidos-cabecalho">
        <h1>Meus pedidos</h1>
        <p>Acompanhe suas compras e consulte os detalhes dos pedidos.</p>
      </header>

      <div className="pedidos-busca">
        <FiSearch aria-hidden="true" />

        <input
          type="search"
          aria-label="Buscar pelo número do pedido"
          placeholder="Buscar pelo número do pedido..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {carregando && (
        <p className="pedidos-estado" role="status">
          Carregando pedidos...
        </p>
      )}

      {mensagem && (
        <p className="pedidos-estado" role="alert">
          {mensagem}
        </p>
      )}

      {!carregando && !mensagem && (
        <div className="pedidos-lista">
          {pedidosFiltrados.map(pedido => {
            const totalPecas = pedido.itens.reduce(
              (total, item) => total + item.quantidade,
              0
            );

            return (
              <article className="pedido-card" key={pedido._id}>
                <header className="pedido-card-cabecalho">
                  <strong>Pedido #{pedido.numero}</strong>

                  <div>
                    <span>Data</span>
                    <span>
                      {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div>
                    <span>Pagamento</span>
                    <span>
                      {pedido.pagamento}
                      {pedido.parcelas > 1 && ` · ${pedido.parcelas}x`}
                    </span>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      {formatarPreco(pedido.totalCentavos)}
                    </strong>
                  </div>
                </header>

                <div className="pedido-card-conteudo">
                  <div className="pedido-imagens">
                    {pedido.itens.slice(0, 2).map((item, indice) => (
                      <img
                        key={`${item.produtoId}-${item.tamanho}-${indice}`}
                        src={item.imagemUrl}
                        alt={item.nome}
                        loading="lazy"
                      />
                    ))}

                    {pedido.itens.length > 2 && (
                      <span>+{pedido.itens.length - 2}</span>
                    )}
                  </div>

                  <div className="pedido-produtos">
                    {pedido.itens.slice(0, 2).map((item, indice) => (
                      <h2 key={`${item.produtoId}-${item.tamanho}-${indice}`}>
                        {item.nome}
                      </h2>
                    ))}

                    <p>
                      {pedido.itens.length} item(ns) · {totalPecas} peça(s)
                    </p>
                  </div>

                  <button
                    type="button"
                    className="pedido-botao-detalhes"
                    onClick={() => abrirDetalhes(pedido)}
                  >
                    Ver detalhes
                    <FiArrowRight aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}

          {pedidosFiltrados.length === 0 && (
            <p className="pedidos-estado">
              {pedidos.length === 0
                ? 'Você ainda não realizou nenhum pedido.'
                : 'Nenhum pedido encontrado com esse número.'}
            </p>
          )}
        </div>
      )}

      <Link to="/loja" className="pedidos-continuar">
        <FiArrowLeft aria-hidden="true" />
        Continuar comprando
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

export default MeusPedidos;