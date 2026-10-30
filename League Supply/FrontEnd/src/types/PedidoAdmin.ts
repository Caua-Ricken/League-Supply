import type { Pedido } from './Pedido';

export interface PedidoAdmin extends Pedido {
  cliente: {
    nome: string;
    email: string;
  } | null;
}