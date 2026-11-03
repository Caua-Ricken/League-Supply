import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const RotaUsuario = () => {
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    let encerrado = false;

    function sair(mensagem: string) {
      if (encerrado) return;

      encerrado = true;
      setAutorizado(false);

      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      window.alert(mensagem);
      navigate('/', { replace: true });
    }

    function verificarSessao() {
      const token = localStorage.getItem('token');

      if (!token) {
        sair('Faça login para acessar a loja.');
        return;
      }

      try {
        const payload = token.split('.')[1];

        if (!payload) {
          sair('Sessão inválida. Faça login novamente.');
          return;
        }

        const base64 = payload
          .replace(/-/g, '+')
          .replace(/_/g, '/');

        const base64Completo = base64.padEnd(
          Math.ceil(base64.length / 4) * 4,
          '='
        );

        const dados = JSON.parse(atob(base64Completo));

        if (typeof dados.exp !== 'number') {
          sair('Sessão inválida. Faça login novamente.');
          return;
        }

        if (Date.now() >= dados.exp * 1000) {
          sair('Sua sessão expirou. Faça login novamente.');
          return;
        }

        setAutorizado(true);
      } catch {
        sair('Sessão inválida. Faça login novamente.');
      }
    }

    verificarSessao();

    const intervalo = window.setInterval(
      verificarSessao,
      1000
    );

    return () => {
      encerrado = true;
      window.clearInterval(intervalo);
    };
  }, [navigate]);

  return autorizado ? <Outlet /> : null;
};

export default RotaUsuario;