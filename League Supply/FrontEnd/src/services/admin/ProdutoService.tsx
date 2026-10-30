import type { Produto, ProdutoInput } from '../../types/Produto';

const API_URL = 'https://league-supply.onrender.com/api/produtos';

export const buscarProdutos = async (): Promise<Produto[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Faça login para gerenciar os produtos.');
    }

    const resposta = await fetch(API_URL, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resposta.json();

    if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível buscar os produtos.');
    }

    return data;
};


export const cadastrarProduto = async (dados: ProdutoInput): Promise<Produto> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Faça login para gerenciar os produtos.');
    }

    const resposta = await fetch(`${API_URL}/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
    });
    const data = await resposta.json();

    if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível cadastrar o produto.');
    }

    return data;
};

export const editarProduto = async (id: string, dados: ProdutoInput): Promise<Produto> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Faça login para gerenciar os produtos.');
    }

    const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
    });
    const data = await resposta.json();

    if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível editar o produto.');
    }

    return data;
};

export const excluirProduto = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Faça login para gerenciar os produtos.');
    }

    const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!resposta.ok) {
        const data = await resposta.json();
        throw new Error(data.message || 'Não foi possível excluir o produto.');
    }
};


