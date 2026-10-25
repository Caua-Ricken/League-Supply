import { useEffect, useState } from 'react';
import ProdutoCard from '../../../components/admin/produtos/ProdutosCard';
import ProdutoForm from '../../../components/admin/produtos/ProdutoForm';
import type { Produto, ProdutoInput } from '../../../types/Produto';
import './Produtos.css';
import {
  buscarProdutos,
  cadastrarProduto,
  editarProduto as editarProdutoAPI,
  excluirProduto as excluirProdutoAPI,
} from '../../../services/admin/ProdutoService';

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [open, setOpen] = useState(false);

  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
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

    carregarProdutos();
  }, []);

  const [produtoSelecionado, setProdutoSelecionado] =
    useState<Produto | null>(null);

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

  async function salvarProduto(dados: ProdutoInput) {
    if (salvando) return;

    setMensagem('');
    setSalvando(true);

    try {
      if (produtoSelecionado) {
        const atualizado = await editarProdutoAPI(
          produtoSelecionado._id,
          dados
        );

        setProdutos(anteriores =>
          anteriores.map(produto =>
            produto._id === atualizado._id ? atualizado : produto
          )
        );
      } else {
        const cadastrado = await cadastrarProduto(dados);

        setProdutos(anteriores => [...anteriores, cadastrado]);
      }

      fecharFormulario();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar produto.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirProduto(produto: Produto) {
    const confirmar = window.confirm(
      `Deseja excluir "${produto.nome}"?`
    );

    if (!confirmar) return;

    setMensagem('');

    try {
      await excluirProdutoAPI(produto._id);

      setProdutos(anteriores =>
        anteriores.filter(item => item._id !== produto._id)
      );
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir produto.'
      );
    }
  }

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

      {mensagem && <p role="alert">{mensagem}</p>}
      {carregando && <p role="status">Carregando produtos...</p>}

      {open ? (
        <ProdutoForm
          produto={produtoSelecionado}
          onSalvar={salvarProduto}
          onCancelar={fecharFormulario}
          salvando={salvando}
        />
      ) : (
        <div className="produtos-grid">
          {produtos.map(produto => (
            <ProdutoCard
              key={produto._id}
              produto={produto}
              onEditar={() => editarProduto(produto)}
              onExcluir={() => excluirProduto(produto)}
            />
          ))}

          {!carregando && !mensagem && produtos.length === 0 && (
            <p className="produtos-vazio">
              Nenhum produto cadastrado.
            </p>
          )}
        </div>
      )}

    </section>
  );
};

export default Produtos;
