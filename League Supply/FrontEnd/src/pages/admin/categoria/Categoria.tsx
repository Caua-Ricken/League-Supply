import { useEffect, useState } from 'react';
import CategoriaForm from '../../../components/admin/categoria/CategoriaForm';
import type { Categoria } from '../../../types/Categotia';

import {
  buscarCategorias,
  excluirCategoria as excluirCategoriaAPI,
} from '../../../services/admin/CategotiaService';

import './Categorias.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);

  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [excluindo, setExcluindo] = useState(false);

  async function carregarCategorias() {
    setMensagem('');
    setLoading(true);

    try {
      const dados = await buscarCategorias();
      setCategorias(dados);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao buscar categorias.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  function novaCategoria() {
    setCategoriaSelecionada(null);
    setOpen(true);
  }

  function editarCategoria(categoria: Categoria) {
    setCategoriaSelecionada(categoria);
    setOpen(true);
  }

  function fecharFormulario() {
    setOpen(false);
    setCategoriaSelecionada(null);
  }

  async function excluirCategoria(categoria: Categoria) {
    if (excluindo) return;

    if (!window.confirm(`Excluir "${categoria.nome}"?`)) {
      return;
    }

    setExcluindo(true);
    setMensagem('');

    try {
      await excluirCategoriaAPI(categoria._id);
      await carregarCategorias();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir categoria.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome
      .toLowerCase()
      .includes(busca.trim().toLowerCase())
  );

  return (
    <section className="categorias-page">
      <header className="categorias-cabecalho">
        <div>
          <h1>Categorias</h1>
          <p>Organize os artigos da sua loja.</p>
        </div>

        <button
          type="button"
          className="categoria-botao-principal"
          onClick={novaCategoria}
        >
          + Nova categoria
        </button>
      </header>

      {mensagem && (
        <p className="categoria-erro" role="alert">
          {mensagem}
        </p>
      )}

      <div className="categorias-painel">
        <div className="categorias-filtros">
          <input
            aria-label="Buscar categoria"
            placeholder="Buscar categoria..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />

          <span>{categorias.length} categorias</span>
        </div>

        {loading && (
          <p className="categorias-aviso" role="status">
            Loading categorias...
          </p>
        )}

        <ul className="categorias-lista">
          {categoriasFiltradas.map(categoria => (
            <li key={categoria._id}>
              <div className="categoria-identidade">
                <span
                  className="categoria-inicial"
                  aria-hidden="true"
                >
                  {categoria.nome.charAt(0).toUpperCase()}
                </span>

                <strong>{categoria.nome}</strong>
              </div>

              <div className="categoria-item-acoes">
                <button
                  type="button"
                  onClick={() => editarCategoria(categoria)}
                  disabled={excluindo}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="categoria-excluir"
                  onClick={() => excluirCategoria(categoria)}
                  disabled={excluindo}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        {!loading &&
          !mensagem &&
          categoriasFiltradas.length === 0 && (
            <p className="categorias-aviso">
              Nenhuma categoria encontrada.
            </p>
          )}
      </div>

      {open && (
        <CategoriaForm
          categoria={categoriaSelecionada}
          onFechar={fecharFormulario}
          onAtualizar={carregarCategorias}
        />
      )}
    </section>
  );
};

export default Categorias;