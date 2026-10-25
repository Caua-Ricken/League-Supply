import { useState } from 'react';
import times from '../../../data/times.json';
import type { Produto } from '../../../types/Produto';
import {
  excluirProduto as excluirProdutoAPI,
} from '../../../services/admin/ProdutoService';
import './ProdutoCard.css';

interface Props {
  produto: Produto;
  onEditar: () => void;
  onAtualizar: () => Promise<void>;
}

const ProdutoCard = ({
  produto,
  onEditar,
  onAtualizar,
}: Props) => {
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const time = times.find(
    time => time.id === produto.timeId
  );

  const estoque = produto.variantes.reduce(
    (total, variante) => total + variante.estoque,
    0
  );

  const preco = (
    produto.precoCentavos / 100
  ).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  async function excluir() {
    if (excluindo) return;

    const confirmou = window.confirm(
      `Deseja excluir "${produto.nome}"?`
    );

    if (!confirmou) return;

    setMensagem('');
    setExcluindo(true);

    try {
      await excluirProdutoAPI(produto._id);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir produto.'
      );

      setExcluindo(false);
      return;
    }

    await onAtualizar();
  }

  return (
    <article className="produto-card">
      <img
        className="produto-foto"
        src={produto.imagemUrl}
        alt={produto.nome}
      />

      <div className="produto-info">
        <div className="produto-identidade">
          {time && (
            <img
              className="time-logo"
              src={time.logoUrl}
              alt={time.nome}
            />
          )}

          <span className="liga-badge">
            {produto.liga}
          </span>
        </div>

        <span>
          {time?.nome ?? 'Time não encontrado'}
        </span>

        <h2>{produto.nome}</h2>

        <strong className="produto-preco">
          {preco}
        </strong>

        <p className="produto-estoque">
          {estoque} em estoque
        </p>

        {mensagem && (
          <p role="alert">{mensagem}</p>
        )}

        <div className="produto-acoes">
          <button
            type="button"
            onClick={onEditar}
            disabled={excluindo}
          >
            Editar
          </button>

          <button
            type="button"
            className="botao-excluir"
            onClick={excluir}
            disabled={excluindo}
          >
            {excluindo ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProdutoCard;