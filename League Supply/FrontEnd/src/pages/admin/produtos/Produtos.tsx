import { useEffect, useState } from 'react';
import ProdutoCard from '../../../components/admin/produtos/ProdutosCard';
import ProdutoForm from '../../../components/admin/produtos/ProdutoForm';
import { buscarProdutos } from '../../../services/admin/ProdutoService';
import type { Produto } from '../../../types/Produto';
import './Produtos.css';

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<Produto | null>(null);

  const [open, setOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const [busca, setBusca] = useState('');
  const [liga, setLiga] = useState('');

  async function carregarProdutos() {
    setCarregando(true);
    setMensagem('');

    try {
      const dados = await buscarProdutos();
      setProdutos(dados);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar produtos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  function novoProduto() {
    setProdutoSelecionado(null);
    setOpen(true);
  }

  function editarProduto(produto: Produto) {
    setProdutoSelecionado(produto);
    setOpen(true);
  }

  function fecharFormulario() {
    setOpen(false);
    setProdutoSelecionado(null);
  }

  const produtosFiltrados = produtos.filter(produto => {
    const correspondeNome = produto.nome
      .toLowerCase()
      .includes(busca.trim().toLowerCase());

    const correspondeLiga = liga === '' || produto.liga === liga;

    return correspondeNome && correspondeLiga;
  });

  return (
    <section className="produtos-page">
      <header className="produtos-cabecalho">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os artigos da sua loja.</p>
        </div>

        {!open && (
          <button
            type="button"
            className="botao-principal"
            onClick={novoProduto}
          >
            + Novo produto
          </button>
        )}
      </header>

      {mensagem && (
        <p role="alert">{mensagem}</p>
      )}

      {open ? (
        <ProdutoForm
          produto={produtoSelecionado}
          onFechar={fecharFormulario}
          onAtualizar={carregarProdutos}
        />
      ) : (
        <>
          <div className="produtos-filtros">
            <input
              type="search"
              aria-label="Buscar produto pelo nome"
              placeholder="Buscar produto..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />

            <select
              aria-label="Filtrar por liga"
              value={liga}
              onChange={e => setLiga(e.target.value)}
            >
              <option value="">Todas as ligas</option>
              <option value="NBA">NBA</option>
              <option value="NFL">NFL</option>
              <option value="MLB">MLB</option>
              <option value="NHL">NHL</option>
            </select>
          </div>

          {carregando && (
            <p role="status">Carregando produtos...</p>
          )}

          <div className="produtos-grid">
            {produtosFiltrados.map(produto => (
              <ProdutoCard
                key={produto._id}
                produto={produto}
                onEditar={() => editarProduto(produto)}
                onAtualizar={carregarProdutos}
              />
            ))}
          </div>

          {!carregando &&
            !mensagem &&
            produtosFiltrados.length === 0 && (
              <p className="produtos-vazio">
                {produtos.length === 0
                  ? 'Nenhum produto cadastrado.'
                  : 'Nenhum produto encontrado com esses filtros.'}
              </p>
            )}
        </>
      )}
    </section>
  );
};

export default Produtos;