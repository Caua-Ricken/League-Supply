import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

import './Error.css';

const NaoEncontrado = () => {
  const navigate = useNavigate();

  return (
    <main className="nao-encontrado-page">
      <Link to="/" className="nao-encontrado-brand">
        LEAGUE<span>★</span>SUPPLY
      </Link>

      <div className="nao-encontrado-conteudo">
        <span className="nao-encontrado-legenda">
          FORA DE CAMPO
        </span>

        <strong className="nao-encontrado-numero">
          404
        </strong>

        <h1>Essa página não entrou em jogo.</h1>

        <p>
          O endereço que você acessou não existe ou foi alterado.
          Volte para continuar navegando.
        </p>

        <div className="nao-encontrado-acoes">
          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft aria-hidden="true" />
            Voltar
          </button>

          <Link to="/">
            <FiHome aria-hidden="true" />
            Ir para o início
          </Link>
        </div>
      </div>

      <footer className="nao-encontrado-footer">
        American Sports Culture · League Supply
      </footer>
    </main>
  );
};

export default NaoEncontrado;