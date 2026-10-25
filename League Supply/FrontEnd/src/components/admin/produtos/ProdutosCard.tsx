import times from '../../../data/times.json';
import type { Produto } from '../../../types/Produto';
import './ProdutoCard.css'

interface Props {
  produto: Produto;
  onEditar: () => void;
  onExcluir: () => void;
}

const ProdutoCard = ({ produto, onEditar, onExcluir }: Props) => {
  const time = times.find(time => time.id === produto.timeId);

  const estoque = produto.variantes.reduce(
    (total, variante) => total + variante.estoque,
    0
  );

  const preco = (produto.precoCentavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

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

          <span className="liga-badge">{produto.liga}</span>
        </div>

        <span>{time?.nome ?? 'Time não encontrado'}</span>

        <h2>{produto.nome}</h2>

        <strong className="produto-preco">{preco}</strong>

        <p className="produto-estoque">
          {estoque} em estoque
        </p>

        <div className="produto-acoes">
          <button type="button" onClick={onEditar}>
            Editar
          </button>

          <button
            type="button"
            className="botao-excluir"
            onClick={onExcluir}
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProdutoCard;