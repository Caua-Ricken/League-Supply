import { useState, type FormEvent } from 'react'
import { FazerLogin } from '../../services/auth/Login'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const entrar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const data = await FazerLogin(email.trim(), senha)
            setMessage(data.message || 'Login realizado com sucesso!')
            setSenha('')
            setEmail('')

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            setTimeout(() => {
                if (data.usuario.role === "admin") {
                navigate("/administrador");
                return;
              };
        
              if (data.usuario.role === "usuario") {
                navigate("/loja");
                return;
              };
        
              localStorage.removeItem("token");
              localStorage.removeItem("usuario");
        
              setMessage("Perfil de usuário inválido");
              }, 1500);

        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível entrar.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page">
            <aside className="brand-panel">
                <div className="brand-logo">
                    LEAGUE<span>★</span>SUPPLY
                    <small>AMERICAN SPORTS CULTURE</small>
                </div>

                <div className="brand-content">
                    <p className="brand-eyebrow">
                        A SUA TORCIDA COMEÇA AQUI
                    </p>

                    <h1>
                        SEU TIME.<br />
                        SUA HISTÓRIA.<br />
                        <span>SUA PAIXÃO.</span>
                    </h1>

                    <p className="brand-description">
                        Das arquibancadas para o seu dia a dia.
                        Um só lugar para quem vive os esportes americanos.
                    </p>

                    <ul className="league-list" aria-label="Ligas esportivas">
                        {['NBA', 'NFL', 'MLB', 'NHL'].map(liga => (
                            <li key={liga}>
                                <img
                                    src={`/images/leagues/${liga.toLowerCase()}.${liga === 'NHL' ? 'svg' : 'png'}`}
                                    alt={`Logo da ${liga}`}
                                    width={36}
                                    height={40}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="brand-footer">
                    EST. 2026 / BUILT FOR FANS
                </p>
            </aside>

            <section className="form-panel">
                <div className="login-content">
                    <p className="form-eyebrow">
                        BEM-VINDO À LEAGUE SUPPLY
                    </p>

                    <h2>ENTRE NO JOGO.</h2>

                    <p className="form-description">
                        Faça login para encontrar os artigos do seu time favorito.
                    </p>

                    <form onSubmit={entrar}>
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="username"
                            placeholder="voce@exemplo.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="senha">Senha</label>
                        <div className="password-field">
                            <input
                                id="senha"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Sua senha"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        {message && (
                            <p className="form-message" role="status">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading ? 'ENTRANDO...' : 'ENTRAR'}
                        </button>
                    </form>

                    <p className="signup-message">
                        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                    </p>

                    <p className="login-note">
                        Vista sua paixão. Entre com sua conta para fazer
                        parte da League Supply.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Login

