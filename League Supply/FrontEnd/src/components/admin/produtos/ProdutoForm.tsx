import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

import times from '../../../data/times.json';

import type { Produto, ProdutoInput } from '../../../types/Produto';
import type { Categoria } from '../../../types/Categotia';

import {
  cadastrarProduto,
  editarProduto as editarProdutoAPI,
} from '../../../services/admin/ProdutoService';

import { buscarCategorias } from '../../../services/admin/CategotiaService';

import './ProdutoForm.css';

interface Props {
  produto: Produto | null;
  onFechar: () => void;
  onAtualizar: () => Promise<void>;
}

const ProdutoForm = ({ produto, onFechar, onAtualizar }: Props) => {
  const [nome, setNome] = useState(produto?.nome ?? '');
  const [liga, setLiga] = useState(produto?.liga ?? '');
  const [timeId, setTimeId] = useState(produto?.timeId ?? '');
  const [categoria, setCategoria] = useState(produto?.categoria ?? '');
  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl ?? '');

  const [preco, setPreco] = useState(
    produto ? String(produto.precoCentavos / 100) : ''
  );

  const [variantes, setVariantes] = useState(
    ['Único', 'P', 'M', 'G', 'GG'].map(tamanho => ({
      tamanho,
      estoque:
        produto?.variantes.find(
          item => item.tamanho === tamanho
        )?.estoque ?? 0,
    }))
  );

  const [tamanhoUnico, setTamanhoUnico] = useState(
    produto?.variantes.length === 1 &&
    produto.variantes[0]?.tamanho === 'Único'
  );

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const timesDaLiga = times.filter(time => time.liga === liga);

  const timeSelecionado = times.find(
    time => time.id === timeId
  );

  const variantesSelecionadas = variantes.filter(item =>
    tamanhoUnico
      ? item.tamanho === 'Único'
      : item.tamanho !== 'Único'
  );

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await buscarCategorias();
        setCategorias(dados);
      } catch {
        setMensagem('Erro ao carregar categorias.');
      }
    }

    carregarCategorias();
  }, []);

  function alterarEstoque(tamanho: string, estoque: number) {
    setVariantes(anteriores =>
      anteriores.map(item =>
        item.tamanho === tamanho
          ? { ...item, estoque }
          : item
      )
    );
  }

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (salvando) return;

    setMensagem('');

    if (
      liga !== 'NBA' &&
      liga !== 'NFL' &&
      liga !== 'MLB' &&
      liga !== 'NHL'
    ) {
      setMensagem('Selecione uma liga válida.');
      return;
    }

    const dados: ProdutoInput = {
      nome: nome.trim(),
      liga,
      timeId,
      categoria,
      precoCentavos: Math.round(Number(preco) * 100),
      imagemUrl: imagemUrl.trim(),
      variantes: variantesSelecionadas,
      ativo: produto?.ativo ?? true,
    };

    setSalvando(true);

    try {
      if (produto) {
        await editarProdutoAPI(produto._id, dados);
      } else {
        await cadastrarProduto(dados);
      }
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar produto.'
      );

      setSalvando(false);
      return;
    }

    try {
      await onAtualizar();
    } catch {
      setMensagem(
        'Produto salvo, mas não foi possível atualizar a listagem. Feche o formulário e recarregue a página.'
      );

      setSalvando(false);
      return;
    }

    setSalvando(false);
    onFechar();
  }

  return (
    <form className="produto-form" onSubmit={salvar}>
      <h2>{produto ? 'Editar produto' : 'Novo produto'}</h2>

      {mensagem && (
        <p role="alert">{mensagem}</p>
      )}

      <label>
        Nome do produto

        <input
          value={nome}
          onChange={event => setNome(event.target.value)}
          placeholder="Ex.: Regata Chicago Bulls"
          required
          pattern=".*\S.*"
          disabled={salvando}
        />
      </label>

      <div className="form-linha">
        <label>
          Liga

          <select
            value={liga}
            onChange={event => {
              setLiga(event.target.value);
              setTimeId('');
            }}
            required
            disabled={salvando}
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
            onChange={event => setTimeId(event.target.value)}
            disabled={!liga || salvando}
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
          onChange={event => setCategoria(event.target.value)}
          required
          disabled={salvando}
        >
          <option value="">Selecione uma categoria</option>

          {categorias.map(item => (
            <option key={item._id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>
      </label>

      <label>
        Preço (R$)

        <input
          type="number"
          min="0"
          step="0.01"
          value={preco}
          onChange={event => setPreco(event.target.value)}
          placeholder="349,90"
          required
          disabled={salvando}
        />
      </label>

      <div className="produto-tipo-estoque">
  <label className="produto-tipo-tamanho">
    Tipo de tamanho

    <select
      value={tamanhoUnico ? 'unico' : 'roupa'}
      onChange={event =>
        setTamanhoUnico(event.target.value === 'unico')
      }
      disabled={salvando}
    >
      <option value="roupa">Tamanhos de roupa</option>
      <option value="unico">Tamanho único</option>
    </select>
  </label>

  <fieldset
    className="estoque-fieldset"
    disabled={salvando}
  >
    <legend>
      {tamanhoUnico ? 'Estoque' : 'Estoque por tamanho'}
    </legend>

    <div className="tamanhos-grid">
      {variantesSelecionadas.map(item => (
        <label key={item.tamanho}>
          {item.tamanho}

          <input
            type="number"
            min="0"
            step="1"
            value={item.estoque}
            onChange={event =>
              alterarEstoque(
                item.tamanho,
                Number(event.target.value)
              )
            }
            required
          />
        </label>
      ))}
    </div>
  </fieldset>
</div>

      <label>
        URL da foto do produto

        <input
          type="url"
          value={imagemUrl}
          onChange={event => setImagemUrl(event.target.value)}
          placeholder="https://site.com/produto.webp"
          required
          disabled={salvando}
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
          onClick={onFechar}
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