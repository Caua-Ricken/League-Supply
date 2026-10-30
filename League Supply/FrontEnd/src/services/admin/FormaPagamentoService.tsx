import type {
    FormaPagamento,
    FormaPagamentoInput,
  } from '../../types/FormaPagamento';
  
  const API_URL = 'https://league-supply.onrender.com/api/formas-pagamento';
  
  export const buscarFormasPagamento = async (): Promise<
    FormaPagamento[]
  > => {
    const token = localStorage.getItem('token');
  
    const resposta = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await resposta.json();
  
    if (!resposta.ok) {
      throw new Error(
        data.message || 'Erro ao buscar formas de pagamento.'
      );
    }
  
    return data;
  };
  
  export const cadastrarFormaPagamento = async (
    dados: FormaPagamentoInput
  ): Promise<FormaPagamento> => {
    const token = localStorage.getItem('token');
  
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
      throw new Error(
        data.message || 'Erro ao cadastrar forma de pagamento.'
      );
    }
  
    return data;
  };
  
  export const editarFormaPagamento = async (
    id: string,
    dados: FormaPagamentoInput
  ): Promise<FormaPagamento> => {
    const token = localStorage.getItem('token');
  
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
      throw new Error(
        data.message || 'Erro ao editar forma de pagamento.'
      );
    }
  
    return data;
  };
  
  export const excluirFormaPagamento = async (
    id: string
  ): Promise<void> => {
    const token = localStorage.getItem('token');
  
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!resposta.ok) {
      const data = await resposta.json();
  
      throw new Error(
        data.message || 'Erro ao excluir forma de pagamento.'
      );
    }
  };

