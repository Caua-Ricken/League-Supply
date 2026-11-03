export const FazerLogin = async (login: string, senha: string, turnstileToken: string) => {
    const res = await fetch("https://league-supply.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        senha,
        turnstileToken,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || "E-mail ou senha inválidos");
    }
  
    return data;
  };