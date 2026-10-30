export const cadastrarUsuario = async (nome: string, email: string, senha: string) => {
  const res = await fetch('https://league-supply.onrender.com/api/auth/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: nome.trim(), email: email.trim().toLowerCase(), senha }),
  })


  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data?.message || 'Não foi possível cadastrar sua conta. Tente novamente.')
  }

  return data;
}
