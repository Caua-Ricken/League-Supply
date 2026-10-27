import type { Request, Response } from 'express';
import type { RequestAutenticado } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import models from '../models/index.js';

const { Usuario } = models;

export default {
  async buscar(_req: Request, res: Response) {
    try {
      const usuarios = await Usuario.find()
        .select('_id nome email role')
        .sort({ nome: 1 });

      return res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erro ao buscar usuários.',
      });
    }
  },

  async cadastrar(req: Request, res: Response) {
    const { nome, email, senha, role } = req.body ?? {};

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        message: 'Informe um nome e um e-mail válido.',
      });
    }

    if (
      typeof senha !== 'string' ||
      senha.length < 6 ||
      Buffer.byteLength(senha, 'utf8') > 72
    ) {
      return res.status(400).json({
        message: 'A senha deve ter pelo menos 6 caracteres e até 72 bytes.',
      });
    }

    if (role !== 'usuario' && role !== 'admin') {
      return res.status(400).json({
        message: 'Selecione um perfil válido.',
      });
    }

    try {
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const usuario = await Usuario.create({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senhaCriptografada,
        role,
      });

      // Retorna somente os dados que a tela precisa.
      return res.status(201).json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      });
    } catch (error) {
      if (
        error instanceof mongoose.mongo.MongoServerError &&
        error.code === 11000
      ) {
        return res.status(409).json({
          message: 'Este e-mail já está cadastrado.',
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Erro ao cadastrar usuário.',
      });
    }
  },

  async editar(req: RequestAutenticado, res: Response) {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body ?? {};

    if (
      typeof id !== 'string' ||
      !mongoose.isObjectIdOrHexString(id)
    ) {
      return res.status(400).json({
        message: 'ID do usuário inválido.',
      });
    }

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        message: 'Informe um nome e um e-mail válido.',
      });
    }

    if (role !== 'usuario' && role !== 'admin') {
      return res.status(400).json({
        message: 'Selecione um perfil válido.',
      });
    }

    if (
      senha !== undefined &&
      senha !== '' &&
      (
        typeof senha !== 'string' ||
        senha.length < 6 ||
        Buffer.byteLength(senha, 'utf8') > 72
      )
    ) {
      return res.status(400).json({
        message: 'A senha deve ter pelo menos 6 caracteres e até 72 bytes.',
      });
    }

    const autenticado = req.usuario;

    if (
      autenticado &&
      typeof autenticado !== 'string' &&
      autenticado.id === id &&
      role !== 'admin'
    ) {
      return res.status(400).json({
        message: 'Você não pode remover sua própria permissão de administrador.',
      });
    }

    try {
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({
          message: 'Usuário não encontrado.',
        });
      }

      usuario.nome = nome.trim();
      usuario.email = email.trim().toLowerCase();
      usuario.role = role;

      // Só altera a senha quando uma nova foi informada.
      if (typeof senha === 'string' && senha !== '') {
        usuario.senha = await bcrypt.hash(senha, 10);
      }

      await usuario.save();

      return res.status(200).json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      });
    } catch (error) {
      if (
        error instanceof mongoose.mongo.MongoServerError &&
        error.code === 11000
      ) {
        return res.status(409).json({
          message: 'Este e-mail já está cadastrado.',
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Erro ao editar usuário.',
      });
    }
  },

  async excluir(req: RequestAutenticado, res: Response) {
    const { id } = req.params;

    if (
      typeof id !== 'string' ||
      !mongoose.isObjectIdOrHexString(id)
    ) {
      return res.status(400).json({
        message: 'ID do usuário inválido.',
      });
    }

    const autenticado = req.usuario;

    if (
      autenticado &&
      typeof autenticado !== 'string' &&
      autenticado.id === id
    ) {
      return res.status(400).json({
        message: 'Você não pode excluir sua própria conta.',
      });
    }

    try {
      const usuario = await Usuario.findByIdAndDelete(id);

      if (!usuario) {
        return res.status(404).json({
          message: 'Usuário não encontrado.',
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erro ao excluir usuário.',
      });
    }
  },
};