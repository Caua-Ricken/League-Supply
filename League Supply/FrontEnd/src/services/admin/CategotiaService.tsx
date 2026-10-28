import type {
    Categoria,
    CategoriaInput,
  } from '../../types/Categotia';
  
  const API_URL = 'http://localhost:3000/api/categorias';
  
  // GET — listar categorias
  export const buscarCategorias = async (): Promise<Categoria[]> => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(
        data.message || 'Não foi possível buscar as categorias.'
      );
    }
  
    return data;
  };
  
  // POST — cadastrar categoria
  export const cadastrarCategoria = async (dados: CategoriaInput): Promise<Categoria> => {
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
      throw new Error(
        data.message || 'Não foi possível cadastrar a categoria.'
      );
    }
  
    return data;
  };
  
  // PUT — editar categoria
  export const editarCategoria = async (id: string, dados: CategoriaInput): Promise<Categoria> => {
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
      throw new Error(
        data.message || 'Não foi possível editar a categoria.'
      );
    }
  
    return data;
  };
  
  // DELETE — excluir categoria
  export const excluirCategoria = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const data = await res.json();
  
      throw new Error(
        data.message || 'Não foi possível excluir a categoria.'
      );
    }
  };

