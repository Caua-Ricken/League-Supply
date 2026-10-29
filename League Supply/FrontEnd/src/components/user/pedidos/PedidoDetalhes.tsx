import { useEffect, useRef } from 'react';
import type { Pedido } from '../../../types/Pedido';

interface Props {
  pedido: Pedido;
  onFechar: () => void;
}

function formatarPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

const PedidoDetalhes = ({ pedido, onFechar }: Props) => {
  const modal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modal.current;

    dialog?.showModal();

    return () => {
      dialog?.close();
    };
  }, []);

  return (
    <dialog
      ref={modal}
      className="pedido-modal"
      aria-labelledby="pedido-modal-titulo"
      onCancel={event => {
        event.preventDefault();
        onFechar();
      }}
    >
      <header className="pedido-modal-cabecalho">
        <div>
          <h2 id="pedido-modal-titulo">
            Pedido #{pedido.numero}
          </h2>

          <p>
            {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <button
          type="button"
          aria-label="Fechar detalhes"
          onClick={onFechar}
        >
          ×
        </button>
      </header>

      <div className="pedido-detalhes-itens">
        {pedido.itens.map((item, indice) => (
          <div
            className="pedido-detalhes-item"
            key={`${item.produtoId}-${item.tamanho}-${indice}`}
          >
            <img src={item.imagemUrl} alt={item.nome} />

            <div>
              <h3>{item.nome}</h3>

              <p>
                Tamanho: {item.tamanho} · Quantidade: {item.quantidade}
              </p>

              <span>
                {formatarPreco(item.precoCentavos)} por unidade
              </span>
            </div>

            <strong>
              {formatarPreco(item.precoCentavos * item.quantidade)}
            </strong>
          </div>
        ))}
      </div>

      <footer className="pedido-modal-resumo">
        <p>
          Pagamento: {pedido.pagamento}
          {pedido.parcelas > 1 && ` · ${pedido.parcelas}x`}
        </p>

        {pedido.vencimento && (
          <p>
            Vencimento:{' '}
            {new Date(pedido.vencimento).toLocaleDateString('pt-BR')}
          </p>
        )}

        {pedido.observacoes && (
          <p className="pedido-observacoes">
            {pedido.observacoes}
          </p>
        )}

        <div>
          <strong>Total do pedido</strong>
          <strong>{formatarPreco(pedido.totalCentavos)}</strong>
        </div>

        <button
          type="button"
          className="pedido-botao-detalhes"
          onClick={onFechar}
        >
          Fechar
        </button>
      </footer>
    </dialog>
  );
};

export default PedidoDetalhes;