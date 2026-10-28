import { useState } from 'react';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';

import times from '../../../data/times.json';
import type { Produto } from '../../../types/Produto';

interface Props {
  produto: Produto;
  onAdicionar: (
    produto: Produto,
    tamanho: string,
    quantidade: number
  ) => void;
}

const LojaProdutoCard = ({ produto, onAdicionar }: Props) => {

  const tamanhos = produto.variantes.filter(
    item => item.estoque > 0
  );
  const [tamanho, setTamanho] = useState(
    tamanhos.length === 1
      ? tamanhos[0]?.tamanho ?? ''
      : ''
  );

  const [quantidade, setQuantidade] = useState(1);

  const time = times.find(item => item.id === produto.timeId);

  const estoque = produto.variantes.find(
    item => item.tamanho === tamanho
  )?.estoque ?? 0;

  const esgotado = tamanhos.length === 0;

  const preco = (produto.precoCentavos / 100).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    }
  );

  return (
    <article className="loja-produto-card">
      <div className="loja-produto-imagem">
        <img
          src={produto.imagemUrl}
          alt={produto.nome}
          loading="lazy"
        />

        {esgotado && (
          <span className="loja-produto-esgotado">
            Esgotado
          </span>
        )}
      </div>

      <div className="loja-produto-conteudo">
        <div className="loja-produto-time">
          <span className="loja-produto-liga">
            {produto.liga}
          </span>

          {time && (
            <>
              <img src={time.logoUrl} alt="" />
              <span>{time.nome}</span>
            </>
          )}
        </div>

        <h3>{produto.nome}</h3>

        <strong className="loja-produto-preco">
          {preco}
        </strong>

        <div className="loja-produto-selecao">
          <label>
            Tamanho

            <select
              value={tamanho}
              onChange={event => {
                setTamanho(event.target.value);
                setQuantidade(1);
              }}
              disabled={esgotado}
            >
              <option value="">
                {esgotado ? 'Indisponível' : 'Selecione'}
              </option>

              {tamanhos.map(item => (
                <option key={item.tamanho} value={item.tamanho}>
                  {item.tamanho}
                </option>
              ))}
            </select>
          </label>

          <div className="loja-produto-quantidade">
            <span>Quantidade</span>

            <div className="loja-quantidade-controle">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                disabled={!tamanho || quantidade <= 1}
                onClick={() =>
                  setQuantidade(prev => Math.max(1, prev - 1))
                }
              >
                <FiMinus aria-hidden="true" />
              </button>

              <output aria-live="polite">{quantidade}</output>

              <button
                type="button"
                aria-label="Aumentar quantidade"
                disabled={!tamanho || quantidade >= estoque}
                onClick={() =>
                  setQuantidade(prev =>
                    Math.min(estoque, prev + 1)
                  )
                }
              >
                <FiPlus aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {tamanho && (
          <small className="loja-produto-disponibilidade">
            {estoque} peça(s) disponível(is) no tamanho {tamanho}
          </small>
        )}

        <button
          type="button"
          className="loja-botao-principal"
          disabled={!tamanho || esgotado || quantidade > estoque}
          onClick={() => onAdicionar(produto, tamanho, quantidade)}
        >
          <FiShoppingCart aria-hidden="true" />
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
};

export default LojaProdutoCard;