export const FazerLogin = async (login: string, senha: string) => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        senha,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || "E-mail ou senha inválidos");
    }
  
    return data;
  };