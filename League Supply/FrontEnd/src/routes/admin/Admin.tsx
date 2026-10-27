import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);

  const encerrando = useRef(false);

  useEffect(() => {
    function sair(mensagem: string) {
      if (encerrando.current) return;

      encerrando.current = true;

      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      setAutorizado(false);

      window.alert(mensagem);
      navigate('/', { replace: true });
    }

    function verificar() {
      const token = localStorage.getItem('token');
      const usuarioSalvo = localStorage.getItem('usuario');

      if (!token || !usuarioSalvo) {
        sair('Faça login como administrador para acessar esta área.');
        return;
      }

      try {
        const usuario = JSON.parse(usuarioSalvo);

        if (usuario?.role !== 'admin') {
          sair('Acesso permitido apenas para administradores.');
          return;
        }

        const parte = token.split('.')[1];

        if (!parte) {
          sair('Sessão inválida. Faça login novamente.');
          return;
        }

        const base64 = parte
          .replace(/-/g, '+')
          .replace(/_/g, '/');

        const payload = JSON.parse(
          atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
        );

        if (
          typeof payload.exp !== 'number' ||
          !Number.isFinite(payload.exp) ||
          Date.now() >= payload.exp * 1000
        ) {
          sair('Sua sessão expirou. Faça login novamente.');
          return;
        }

        setAutorizado(true);
      } catch {
        sair('Sessão inválida. Faça login novamente.');
      }
    }

    verificar();

    const intervalo = window.setInterval(verificar, 1000);

    return () => window.clearInterval(intervalo);
  }, [navigate]);

  return autorizado ? <Outlet /> : null;
};

export default Admin;