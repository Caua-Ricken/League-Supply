import { useState } from 'react';
import type { FormEvent } from 'react';
import times from '../../../data/times.json';
import type { Produto, ProdutoInput } from '../../../types/Produto';
import './ProdutoForm.css';

interface Props {
  produto: Produto | null;
  onSalvar: (dados: ProdutoInput) => Promise<void>;
  onCancelar: () => void;
  salvando: boolean;
}

const ProdutoForm = ({ produto, onSalvar, onCancelar, salvando }: Props) => {
  const [nome, setNome] = useState(produto?.nome ?? '');
  const [liga, setLiga] = useState(produto?.liga ?? '');
  const [timeId, setTimeId] = useState(produto?.timeId ?? '');
  const [categoria, setCategoria] = useState(produto?.categoria ?? '');
  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl ?? '');

  const [preco, setPreco] = useState(
    produto ? String(produto.precoCentavos / 100) : ''
  );

  const [variantes, setVariantes] = useState(
    ['P', 'M', 'G', 'GG'].map(tamanho => ({
      tamanho,
      estoque:
        produto?.variantes.find(item => item.tamanho === tamanho)
          ?.estoque ?? 0,
    }))
  );

  const timesDaLiga = times.filter(time => time.liga === liga);
  const timeSelecionado = times.find(time => time.id === timeId);

  function alterarEstoque(tamanho: string, estoque: number) {
    setVariantes(anteriores =>
      anteriores.map(item =>
        item.tamanho === tamanho ? { ...item, estoque } : item
      )
    );
  }

  function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (salvando) return;

    if (liga !== 'NBA' && liga !== 'NFL' && liga !== 'MLB' && liga !== 'NHL') {
      return
    }

    onSalvar({
      nome: nome.trim(),
      liga,
      timeId,
      categoria,
      precoCentavos: Math.round(Number(preco) * 100),
      imagemUrl: imagemUrl.trim(),
      variantes,
      ativo: produto?.ativo ?? true,
    });
  }

  return (
    <form className="produto-form" onSubmit={salvar}>
      <h2>{produto ? 'Editar produto' : 'Novo produto'}</h2>

      <label>
        Nome do produto
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex.: Regata Chicago Bulls"
          required
          pattern=".*\S.*"
        />
      </label>

      <div className="form-linha">
        <label>
          Liga
          <select
            value={liga}
            onChange={e => {
              setLiga(e.target.value);
              setTimeId('');
            }}
            required
          >
            <option value="">Selecione</option>
            <option value="NBA">NBA</option>
            <option value="NFL">NFL</option>
            <option value="MLB">MLB</option>
            <option value="NHL">NHL</option>
          </select>
        </label>

        <label>
          Time
          <select
            value={timeId}
            onChange={e => setTimeId(e.target.value)}
            disabled={!liga}
            required
          >
            <option value="">Selecione</option>

            {timesDaLiga.map(time => (
              <option key={time.id} value={time.id}>
                {time.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {timeSelecionado && (
        <div className="time-preview">
          <img
            className="time-logo"
            src={timeSelecionado.logoUrl}
            alt={timeSelecionado.nome}
          />

          <span>
            {timeSelecionado.nome} · {timeSelecionado.liga}
          </span>
        </div>
      )}

      <label>
        Categoria
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          <option value="Regatas">Regatas</option>
          <option value="Camisas">Camisas</option>
          <option value="Bonés">Bonés</option>
          <option value="Moletons">Moletons</option>
          <option value="Acessórios">Acessórios</option>
        </select>
      </label>

      <label>
        Preço (R$)
        <input
          type="number"
          min="0"
          step="0.01"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          placeholder="349,90"
          required
        />
      </label>

      <fieldset className="estoque-fieldset">
        <legend>Estoque por tamanho</legend>

        <div className="tamanhos-grid">
          {variantes.map(item => (
            <label key={item.tamanho}>
              {item.tamanho}

              <input
                type="number"
                min="0"
                step="1"
                value={item.estoque}
                onChange={e =>
                  alterarEstoque(
                    item.tamanho,
                    Number(e.target.value)
                  )
                }
                required
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        URL da foto do produto
        <input
          type="url"
          value={imagemUrl}
          onChange={e => setImagemUrl(e.target.value)}
          placeholder="https://site.com/produto.webp"
          required
        />
      </label>

      {imagemUrl && (
        <div className="foto-preview">
          <img src={imagemUrl} alt="Prévia do produto" />
        </div>
      )}

      <div className="form-acoes">
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="botao-principal"
          disabled={salvando}
        >
          {salvando
            ? 'Salvando...'
            : produto
              ? 'Salvar alterações'
              : 'Salvar produto'}
        </button>
      </div>
    </form>
  );
};

export default ProdutoForm;
