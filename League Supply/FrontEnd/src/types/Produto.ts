export type Liga = 'NBA' | 'NFL' | 'MLB' | 'NHL';

export interface Variante {
  tamanho: string;
  estoque: number;
}

export interface ProdutoInput {
  nome: string;
  liga: Liga;
  timeId: string;
  categoria: string;
  precoCentavos: number;
  imagemUrl: string;
  variantes: Variante[];
  ativo: boolean;
}

export interface Produto extends ProdutoInput {
  _id: string;
}