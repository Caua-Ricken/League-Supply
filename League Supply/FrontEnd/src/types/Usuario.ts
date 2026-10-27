export type Perfil = 'usuario' | 'admin';

export interface Usuario {
  _id: string;
  nome: string;
  email: string;
  role: Perfil;
}

export interface UsuarioInput {
  nome: string;
  email: string;
  role: Perfil;
  senha?: string;
}