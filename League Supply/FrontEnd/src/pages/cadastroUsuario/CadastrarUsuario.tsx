import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { cadastrarUsuario } from '../../services/auth/CadastrarUsuario'
import '../login/Login.css'
import './CadastrarUsuario.css'

export default function CadastrarUsuario() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [cadastrado, setCadastrado] = useState(false)

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    if (!nome.trim()) {
      setErro('Informe seu nome.')
      return
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      await cadastrarUsuario(nome, email, senha)
      setSenha('')
      setConfirmacao('')
      setCadastrado(true)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível cadastrar sua conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page register-page">
      <aside className="brand-panel">
        <div className="brand-logo">LEAGUE<span>★</span>SUPPLY<small>AMERICAN SPORTS CULTURE</small></div>
        <div className="brand-content">
          <p className="brand-eyebrow">A SUA TORCIDA COMEÇA AQUI</p>
          <h1>SEU TIME.<br />SUA HISTÓRIA.<br /><span>SUA PAIXÃO.</span></h1>
          <p className="brand-description">Das arquibancadas para o seu dia a dia. Um só lugar para quem vive os esportes americanos.</p>
          <ul className="league-list" aria-label="Ligas esportivas">
            {['NBA', 'NFL', 'MLB', 'NHL'].map(liga => (
              <li key={liga}><img src={`/images/leagues/${liga.toLowerCase()}.${liga === 'NHL' ? 'svg' : 'png'}`} alt={`Logo da ${liga}`} width={36} height={40} /></li>
            ))}
          </ul>
        </div>
        <p className="brand-footer">EST. 2026 / BUILT FOR FANS</p>
      </aside>
      <section className="form-panel" aria-labelledby="register-title">
        <div className="login-content">
          <p className="form-eyebrow">FAÇA PARTE DA LEAGUE SUPPLY</p>
          <h2 id="register-title">{cadastrado ? 'VOCÊ ESTÁ NO TIME.' : 'VENHA PRO TIME.'}</h2>
          {cadastrado ? (
            <div className="register-success" role="status">
              <p>Conta criada com sucesso! Agora você pode entrar com seu e-mail e senha.</p>
              <Link className="login-submit register-login-link" to="/">IR PARA O LOGIN <span aria-hidden="true">→</span></Link>
            </div>
          ) : (
            <>
              <p className="form-description">Crie sua conta e vista a paixão pelo seu time favorito.</p>
              <form onSubmit={cadastrar}>
                <fieldset disabled={loading} className="register-fields">
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" autoComplete="name" placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} required />
                  <label htmlFor="email">E-mail</label>
                  <input id="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  <label htmlFor="senha">Senha</label>
                  <div className="password-field register-password">
                    <input id="senha" type={mostrarSenha ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo de 6 caracteres" minLength={6} value={senha} onChange={e => setSenha(e.target.value)} required />
                    <button type="button" aria-controls="senha confirmar-senha" aria-pressed={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? 'Ocultar' : 'Mostrar'}</button>
                  </div>
                  <label htmlFor="confirmar-senha">Confirmar senha</label>
                  <input id="confirmar-senha" type={mostrarSenha ? 'text' : 'password'} autoComplete="new-password" placeholder="Repita sua senha" minLength={6} value={confirmacao} onChange={e => setConfirmacao(e.target.value)} required />
                </fieldset>
                {erro && <p className="form-message register-error" role="alert">{erro}</p>}
                <button type="submit" className="login-submit" disabled={loading}>{loading ? 'CADASTRANDO...' : 'CRIAR CONTA'}<span aria-hidden="true">→</span></button>
              </form>
              <p className="signup-message">Já tem uma conta? <Link to="/">Faça login</Link></p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
