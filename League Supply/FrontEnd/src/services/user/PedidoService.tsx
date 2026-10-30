import type { Pedido } from '../../types/Pedido';

interface PedidoInput {
  itens: {
    produtoId: string;
    tamanho: string;
    quantidade: number;
  }[];
  formaPagamentoId: string;
  parcelas: number;
}

export const cadastrarPedido = async (dados: PedidoInput): Promise<Pedido> => {
  const res = await fetch(
    'https://league-supply.onrender.com/api/pedidos',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(dados),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const erro = await res.json();

    throw new Error(
      erro.message || 'Não foi possível finalizar o pedido.'
    );
  }

  return data;
};

export const buscarMeusPedidos = async (): Promise<Pedido[]> => {
  const res = await fetch(
    'https://league-supply.onrender.com/api/pedidos/meus',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  const data = res.json();

  if (!res.ok) {
    throw new Error('Não foi possível carregar seus pedidos.');
  }

  return data;
};