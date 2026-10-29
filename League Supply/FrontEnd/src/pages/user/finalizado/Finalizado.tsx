import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiDownload } from 'react-icons/fi';

import CheckoutEtapas from '../../../components/user/checkout/CheckoutEtapas';
import type { Pedido } from '../../../types/Pedido';

import './Finalizado.css';

function formatarPreco(centavos: number) {
    return (centavos / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
}

const Finalizado = () => {
    const location = useLocation();

    const pedido: Pedido | undefined = location.state?.pedido;

    console.log(pedido)

    return (
        <section className="finalizado-page">
            <CheckoutEtapas etapa={3} />

            {!pedido ? (
                <div className="finalizado-vazio">
                    <h1>Nenhum pedido para mostrar</h1>

                    <p>
                        Consulte suas compras na página de meus pedidos.
                    </p>

                    <Link
                        to="/loja/pedidos"
                        className="finalizado-botao-principal"
                    >
                        Ver meus pedidos
                        <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
            ) : (
                <div className="finalizado-painel">
                    <header className="finalizado-cabecalho">
                        <div className="finalizado-icone">
                            <FiCheck aria-hidden="true" />
                        </div>

                        <h1>Pedido registrado!</h1>

                        <p>
                            Seu pedido foi criado. Confira os detalhes abaixo.
                        </p>
                    </header>

                    <div className="finalizado-identificacao">
                        <div>
                            <span>Número do pedido</span>
                            <strong>#{pedido.numero}</strong>
                        </div>

                        <div>
                            <span>Data do pedido</span>
                            <strong>{formatarData(pedido.createdAt)}</strong>
                        </div>
                    </div>

                    <div className="finalizado-layout">
                        <div className="finalizado-produtos">
                            <h2>Itens do pedido</h2>

                            {pedido.itens.map((item, indice) => (
                                <div
                                    className="finalizado-produto"
                                    key={`${item.produtoId}-${item.tamanho}-${indice}`}
                                >
                                    <img
                                        src={item.imagemUrl}
                                        alt={item.nome}
                                    />

                                    <div>
                                        <h3>{item.nome}</h3>

                                        <p>
                                            Tamanho: {item.tamanho} ·{' '}
                                            {item.quantidade} unidade(s)
                                        </p>
                                    </div>

                                    <strong>
                                        {formatarPreco(
                                            item.precoCentavos * item.quantidade
                                        )}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <aside className="finalizado-resumo">
                            <h2>Resumo da compra</h2>

                            <div className="finalizado-resumo-linha">
                                <span>Forma de pagamento</span>
                                <strong>{pedido.pagamento}</strong>
                            </div>

                            <div className="finalizado-resumo-linha">
                                <span>Parcelas</span>

                                <strong>
                                    {pedido.parcelas > 1
                                        ? `${pedido.parcelas}x`
                                        : 'À vista'}
                                </strong>
                            </div>

                            <div className="finalizado-resumo-linha">
                                <span>Total de peças</span>

                                <strong>
                                    {pedido.itens.reduce(
                                        (total, item) => total + item.quantidade,
                                        0
                                    )}
                                </strong>
                            </div>

                            {pedido.vencimento && (
                                <div className="finalizado-resumo-linha">
                                    <span>Vencimento</span>

                                    <strong>
                                        {formatarData(pedido.vencimento)}
                                    </strong>
                                </div>
                            )}

                            <div className="finalizado-total">
                                <strong>Total do pedido</strong>

                                <strong>
                                    {formatarPreco(pedido.totalCentavos)}
                                </strong>
                            </div>

                            {pedido.observacoes && (
                                <p className="finalizado-observacoes">
                                    {pedido.observacoes}
                                </p>
                            )}

                            <p className="finalizado-ajuda">
                                O registro do pedido não confirma o pagamento.
                            </p>
                        </aside>
                    </div>

                    <div className="finalizado-acoes">
                        <Link
                            to="/loja/pedidos"
                            className="finalizado-botao-principal"
                        >
                            Ver meus pedidos
                            <FiArrowRight aria-hidden="true" />
                        </Link>

                        <Link
                            to="/loja"
                            className="finalizado-botao-secundario"
                        >
                            Continuar comprando
                        </Link>

                        <button
                            type="button"
                            className="finalizado-botao-secundario"
                            onClick={() => window.print()}
                        >
                            <FiDownload aria-hidden="true" />
                            Salvar pedido em PDF
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Finalizado;