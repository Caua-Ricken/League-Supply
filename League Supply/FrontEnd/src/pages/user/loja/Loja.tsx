import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid } from 'react-icons/fi';

import LojaProdutoCard from '../../../components/user/loja/LojaProdutoCard';
import { buscarProdutos } from '../../../services/admin/ProdutoService';
import { useCarrinho } from '../../../context/CarrinhoContext';

import times from '../../../data/times.json';
import type { Produto } from '../../../types/Produto';

import './Loja.css';

const ligas = [
    {
        nome: 'NBA',
        descricao: 'Basquete',
        logo: '/images/leagues/nba.png',
    },
    {
        nome: 'NFL',
        descricao: 'Futebol americano',
        logo: '/images/leagues/nfl.png',
    },
    {
        nome: 'MLB',
        descricao: 'Beisebol',
        logo: '/images/leagues/mlb.png',
    },
    {
        nome: 'NHL',
        descricao: 'Hóquei',
        logo: '/images/leagues/nhl.svg',
    },
];

const Loja = () => {
    const [searchParams] = useSearchParams();
    const busca = searchParams.get('busca') ?? '';

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [liga, setLiga] = useState('');
    const [ordenacao, setOrdenacao] = useState('recentes');

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState('');

    const { adicionar: adicionarAoCarrinho } = useCarrinho();

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const dados = await buscarProdutos();
                setProdutos(dados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao carregar a loja.'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarProdutos();
    }, []);

    function adicionar(produto: Produto, tamanho: string, quantidade: number) {
        try {
          adicionarAoCarrinho(produto, tamanho, quantidade);
      
          setAviso(
            `${quantidade} peça(s) de ${produto.nome}, tamanho ${tamanho}, ` +
            'adicionada(s) ao carrinho.'
          );
        } catch (error) {
          setAviso(
            error instanceof Error
              ? error.message
              : 'Não foi possível adicionar ao carrinho.'
          );
        }
      }

    function explorarProdutos() {
        document.getElementById('loja-catalogo')?.scrollIntoView({
            behavior: 'smooth',
        });
    }

    const produtosFiltrados = produtos.filter(produto => {
        const time = times.find(item => item.id === produto.timeId);

        const textoProduto = [
            produto.nome,
            produto.liga,
            produto.categoria,
            time?.nome ?? '',
        ].join(' ').toLowerCase();

        const correspondeBusca = textoProduto.includes(
            busca.trim().toLowerCase()
        );

        const correspondeLiga = !liga || produto.liga === liga;

        return correspondeBusca && correspondeLiga;
    });

    if (ordenacao === 'menor-preco') {
        produtosFiltrados.sort(
            (a, b) => a.precoCentavos - b.precoCentavos
        );
    }

    if (ordenacao === 'maior-preco') {
        produtosFiltrados.sort(
            (a, b) => b.precoCentavos - a.precoCentavos
        );
    }


    return (
        <div className="loja-page">
            <section
                className="loja-hero"
                aria-labelledby="loja-hero-titulo"
            >
                <div className="loja-hero-texto">
                    <span>AMERICAN SPORTS CULTURE</span>

                    <h1 id="loja-hero-titulo">
                        VISTA A SUA<br />
                        TORCIDA.
                    </h1>

                    <p>
                        Os artigos dos seus times favoritos em um só lugar.
                    </p>

                    <button
                        type="button"
                        className="loja-botao-principal"
                        onClick={explorarProdutos}
                    >
                        Explorar produtos →
                    </button>
                </div>
            </section>

            <div className="loja-ligas" aria-label="Filtrar produtos por liga">
                <button
                    type="button"
                    className={!liga ? 'selecionado' : ''}
                    onClick={() => setLiga('')}
                    aria-pressed={!liga}
                >
                    <FiGrid aria-hidden="true" />
                    <strong>Todas as ligas</strong>
                </button>

                {ligas.map(item => (
                    <button
                        key={item.nome}
                        type="button"
                        className={liga === item.nome ? 'selecionado' : ''}
                        onClick={() => setLiga(item.nome)}
                        aria-pressed={liga === item.nome}
                    >
                        <img src={item.logo} alt="" />

                        <span>
                            <strong>{item.nome}</strong>
                            <small>{item.descricao}</small>
                        </span>
                    </button>
                ))}
            </div>

            <section id="loja-catalogo" className="loja-catalogo">
                <header className="loja-catalogo-cabecalho">
                    <div>
                        <h2>{busca ? 'Resultados da busca' : 'Nossos produtos'}</h2>
                        <span>{produtosFiltrados.length} produtos</span>
                    </div>

                    <label>
                        Ordenar por:

                        <select
                            value={ordenacao}
                            onChange={event => setOrdenacao(event.target.value)}
                        >
                            <option value="recentes">Mais recentes</option>
                            <option value="menor-preco">Menor preço</option>
                            <option value="maior-preco">Maior preço</option>
                        </select>
                    </label>
                </header>

                {aviso && (
                    <div className="loja-aviso" role="status">
                        <span>{aviso}</span>

                        <button
                            type="button"
                            onClick={() => setAviso('')}
                            aria-label="Fechar aviso"
                        >
                            ×
                        </button>
                    </div>
                )}

                {carregando && (
                    <p className="loja-estado" role="status">
                        Carregando produtos...
                    </p>
                )}

                {erro && (
                    <p className="loja-estado loja-erro" role="alert">
                        {erro}
                    </p>
                )}

                <div className="loja-produtos-grid">
                    {produtosFiltrados.map(produto => (
                        <LojaProdutoCard
                            key={produto._id}
                            produto={produto}
                            onAdicionar={adicionar}
                        />
                    ))}
                </div>

                {!carregando && !erro && produtosFiltrados.length === 0 && (
                    <p className="loja-estado">
                        Nenhum produto encontrado.
                    </p>
                )}
            </section>
        </div>
    );
};

export default Loja;
