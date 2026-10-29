export interface ItemPedido {
  produtoId: string;
  nome: string;
  imagemUrl: string;
  tamanho: string;
  quantidade: number;
  precoCentavos: number;
}

export interface Pedido {
  _id: string;
  numero: string;
  createdAt: string;
  pagamento: string;
  parcelas: number;
  totalCentavos: number;
  vencimento?: string;
  observacoes?: string;
  itens: ItemPedido[];
}