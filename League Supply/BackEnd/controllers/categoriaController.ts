import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import models from '../models/index.js';

const { Categorias } = models;

export default {
  async buscar(_req: Request, res: Response) {
    try {
      const categorias = await Categorias.find().sort({ nome: 1 });

      return res.status(200).json(categorias);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erro ao buscar categorias.',
      });
    }
  },

  async cadastrar(req: Request, res: Response) {
    const {nome} = req.body;

    if (
      typeof nome !== 'string' ||
      !nome.trim()
    ) {
      return res.status(400).json({
        message: 'Informe um nome para a categoria.',
      });
    }

    try {
      const categoria = await Categorias.create({
        nome: nome.trim(),
      });

      return res.status(201).json(categoria);
    } catch (error) {
      if (
        error instanceof mongoose.mongo.MongoServerError &&
        error.code === 11000
      ) {
        return res.status(409).json({
          message: 'Já existe uma categoria com esse nome.',
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Erro ao cadastrar categoria.',
      });
    }
  },

  async editar(req: Request, res: Response) {
    const { id } = req.params;
    const {nome} = req.body;

    if (
      typeof id !== 'string' ||
      !mongoose.isObjectIdOrHexString(id)
    ) {
      return res.status(400).json({
        message: 'ID da categoria inválido.',
      });
    }

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      nome.trim().length > 60
    ) {
      return res.status(400).json({
        message: 'Informe um nome com até 60 caracteres.',
      });
    }

    try {
      const categoria = await Categorias.findByIdAndUpdate(
        id,
        { nome: nome.trim() },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!categoria) {
        return res.status(404).json({
          message: 'Categoria não encontrada.',
        });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      if (
        error instanceof mongoose.mongo.MongoServerError &&
        error.code === 11000
      ) {
        return res.status(409).json({
          message: 'Já existe uma categoria com esse nome.',
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Erro ao editar categoria.',
      });
    }
  },

  async excluir(req: Request, res: Response) {
    const { id } = req.params;

    if (
      typeof id !== 'string' ||
      !mongoose.isObjectIdOrHexString(id)
    ) {
      return res.status(400).json({
        message: 'ID da categoria inválido.',
      });
    }

    try {
      const categoria = await Categorias.findByIdAndDelete(id);

      if (!categoria) {
        return res.status(404).json({
          message: 'Categoria não encontrada.',
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erro ao excluir categoria.',
      });
    }
  },
};