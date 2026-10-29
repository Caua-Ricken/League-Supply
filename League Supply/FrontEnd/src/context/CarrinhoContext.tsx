import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Produto } from '../types/Produto';

interface ItemCarrinho {
  produtoId: string;
  tamanho: string;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  totalPecas: number;

  adicionar: (
    produto: Produto,
    tamanho: string,
    quantidade: number
  ) => void;

  alterarQuantidade: (
    produto: Produto,
    tamanho: string,
    quantidade: number
  ) => void;

  remover: (produtoId: string, tamanho: string) => void;

  limpar: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

function obterChave(): string {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || 'null'
    );

    const id = usuario?.id ?? usuario?._id;

    if (!id) {
      return '';
    }

    return `carrinho-${id}`;
  } catch {
    return '';
  }
}

function carregarItens(chave: string): ItemCarrinho[] {
  try {
    const dados = JSON.parse(
      localStorage.getItem(chave) || '[]'
    );

    console.log(dados)

    if (Array.isArray(dados)) {
      return dados;
    }

    return [];
  } catch {
    return [];
  }
}

export function CarrinhoProvider({children,}: {children: ReactNode;}) {

  const [chave] = useState(obterChave);

  const [itens, setItens] = useState<ItemCarrinho[]>(
    () => carregarItens(chave)
  );


  function salvar(novosItens: ItemCarrinho[]) {
    if (!chave) {
      throw new Error('Faça login para usar o carrinho.');
    }

    localStorage.setItem(chave, JSON.stringify(novosItens));
    setItens(novosItens);
  };

  function adicionar( produto: Produto, tamanho: string, quantidade: number) {
    if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
      throw new Error('Informe uma quantidade válida.');
    }

    const existente = itens.find(
      item =>
        item.produtoId === produto._id &&
        item.tamanho === tamanho
    );

    if (existente) {
      alterarQuantidade( produto, tamanho, existente.quantidade + quantidade );

      return;
    }

    const variante = produto.variantes.find(
      item => item.tamanho === tamanho
    );

    if (!produto.ativo || !variante || quantidade > variante.estoque) {
      throw new Error('Estoque indisponível para essa quantidade.');
    }

    salvar([
      ...itens,
      {
        produtoId: produto._id,
        tamanho,
        quantidade,
      },
    ]);
  }

  function alterarQuantidade( produto: Produto, tamanho: string, quantidade: number) {
    const variante = produto.variantes.find(
      item => item.tamanho === tamanho
    );

    if (!produto.ativo || !variante || variante.estoque < 1) {
      throw new Error('Produto indisponível.');
    }

    if (
      !Number.isSafeInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > variante.estoque
    ) {
      throw new Error(
        `Escolha entre 1 e ${variante.estoque} unidades.`
      );
    }

    const novosItens = itens.map(item => {
      if (
        item.produtoId === produto._id &&
        item.tamanho === tamanho
      ) {
        return { ...item, quantidade };
      }

      return item;
    });

    salvar(novosItens);
  }

  function remover(produtoId: string, tamanho: string) {
    const novosItens = itens.filter(item => {
      if (
        item.produtoId === produtoId &&
        item.tamanho === tamanho
      ) {
        return false;
      }

      return true;
    });

    salvar(novosItens);
  };

  function limpar() {
    salvar([]);
  }

  const totalPecas = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{ itens, totalPecas, adicionar, alterarQuantidade, remover, limpar}}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  if (!contexto) {
    throw new Error('Use o carrinho dentro de CarrinhoProvider.');
  }

  return contexto;
}