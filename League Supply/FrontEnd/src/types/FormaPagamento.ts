export type TipoPagamento =
  | 'credito'
  | 'debito'
  | 'boleto'
  | 'pix'
  | 'dinheiro';

export interface FormaPagamentoInput {
  nome: string;
  tipo: TipoPagamento;
  ativa: boolean;
  maxParcelas?: number;
  prazoVencimentoDias?: number;
  observacoes: string;
}

export interface FormaPagamento extends FormaPagamentoInput {
  _id: string;
}