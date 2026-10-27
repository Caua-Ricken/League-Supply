import type {
    Usuario,
    UsuarioInput,
  } from '../../types/Usuario';
  
  const API_URL = 'http://localhost:3000/api/usuarios';
  
  export const buscarUsuarios = async (): Promise<Usuario[]> => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao buscar usuários.');
    }
  
    return data;
  };
  
  export const cadastrarUsuario = async (
    dados: UsuarioInput
  ): Promise<Usuario> => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(`${API_URL}/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao cadastrar usuário.');
    }
  
    return data;
  };
  
  export const editarUsuario = async (
    id: string,
    dados: UsuarioInput
  ): Promise<Usuario> => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao editar usuário.');
    }
  
    return data;
  };
  
  export const excluirUsuario = async (
    id: string
  ): Promise<void> => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const data = await res.json();
  
      throw new Error(data.message || 'Erro ao excluir usuário.');
    }
  };