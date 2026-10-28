import './CheckoutEtapas.css';

interface Props {
  etapa: 1 | 2 | 3;
}

const nomes = ['Carrinho', 'Pagamento', 'Finalizado'];

const CheckoutEtapas = ({ etapa }: Props) => {
  return (
    <ol className="checkout-etapas" aria-label="Etapas da compra">
      {nomes.map((nome, indice) => {
        const numero = indice + 1;

        return (
          <li
            key={nome}
            className={numero <= etapa ? 'ativa' : ''}
            aria-current={numero === etapa ? 'step' : undefined}
          >
            <span className="checkout-etapa-numero">
              {numero}
            </span>

            <strong>{nome}</strong>
          </li>
        );
      })}
    </ol>
  );
};

export default CheckoutEtapas;