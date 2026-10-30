import type { PedidoAdmin } from '../../types/PedidoAdmin';

export const buscarTodosPedidos = async (): Promise<PedidoAdmin[]> => {
  const res = await fetch(
    'http://localhost:3000/api/pedidos/pedidos',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  const data = res.json();

  if (!res.ok) {
    throw new Error('Não foi possível carregar os pedidos.');
  }

  return data;
};