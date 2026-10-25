import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import models from '../models/index.js';
const { Produtos } = models;

export default {

    async buscar(req: Request, res: Response) {
        try {
            const produtos = await Produtos.find().sort({ createdAt: -1 });
            return res.status(200).json(produtos);

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar produtos.' });
        }
    },

    async editar(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, liga, timeId, categoria, precoCentavos, imagemUrl, variantes, ativo, } = req.body;

        if (typeof id !== 'string' || !mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({ message: 'ID do produto inválido.' });
        }
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Informe os dados do produto.' });
        }

        try {
            const produto = await Produtos.findById(id);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }

            if (nome !== undefined) produto.nome = nome;
            if (liga !== undefined) produto.liga = liga;
            if (timeId !== undefined) produto.timeId = timeId;
            if (categoria !== undefined) produto.categoria = categoria;
            if (precoCentavos !== undefined) produto.precoCentavos = precoCentavos;
            if (imagemUrl !== undefined) produto.imagemUrl = imagemUrl;
            if (variantes !== undefined) produto.variantes = variantes;
            if (ativo !== undefined) produto.ativo = ativo;

            await produto.save();
            return res.status(200).json(produto);

        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError ||
                error instanceof mongoose.Error.CastError) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao editar produto:', error);
            return res.status(500).json({ message: 'Erro interno ao editar produto.' });
        }
    },

    async excluir(req: Request, res: Response) {
        const { id } = req.params;
        
        if (typeof id !== 'string' || !mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({ message: 'ID do produto inválido.' });
        }

        try {
            const produto = await Produtos.findByIdAndDelete(id);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            return res.status(500).json({ message: 'Erro interno ao excluir produto.' });
        }
    },

    async cadastrar(req: Request, res: Response) {
        try {
            const {
                nome, liga, timeId, categoria, precoCentavos, imagemUrl, variantes, ativo,
            } = req.body;

            if (
                typeof nome !== 'string' || !nome.trim() ||
                typeof timeId !== 'string' || !timeId.trim() ||
                typeof categoria !== 'string' || !categoria.trim() ||
                typeof imagemUrl !== 'string' || !imagemUrl.trim()
            ) {
                return res.status(400).json({
                    message: 'Nome, time, categoria e imagem são obrigatórios.',
                });
            }

            if (!['NBA', 'NFL', 'MLB', 'NHL'].includes(liga)) {
                return res.status(400).json({
                    message: 'Selecione uma liga válida.',
                });
            }

            if (
                typeof precoCentavos !== 'number' ||
                !Number.isSafeInteger(precoCentavos) ||
                precoCentavos < 0
            ) {
                return res.status(400).json({
                    message: 'Informe um preço válido em centavos.',
                });
            }

            if (!Array.isArray(variantes) || variantes.length === 0) {
                return res.status(400).json({
                    message: 'Informe pelo menos um tamanho com estoque.',
                });
            }

            const variantesValidas = variantes.every(item =>
                item !== null &&
                typeof item === 'object' &&
                typeof item.tamanho === 'string' &&
                item.tamanho.trim() !== '' &&
                typeof item.estoque === 'number' &&
                Number.isSafeInteger(item.estoque) &&
                item.estoque >= 0
            );

            if (!variantesValidas) {
                return res.status(400).json({
                    message: 'Informe tamanhos e estoques válidos.',
                });
            }

            if (ativo !== undefined && typeof ativo !== 'boolean') {
                return res.status(400).json({
                    message: 'O campo ativo deve ser verdadeiro ou falso.',
                });
            }

            const produto = await Produtos.create({
                nome: nome.trim(),
                liga,
                timeId: timeId.trim(),
                categoria: categoria.trim(),
                precoCentavos,
                imagemUrl: imagemUrl.trim(),
                variantes,
                ativo: ativo ?? true,
            });

            return res.status(201).json(produto);
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);

            return res.status(500).json({
                message: 'Erro interno ao cadastrar produto.',
            });
        }
    },
}
