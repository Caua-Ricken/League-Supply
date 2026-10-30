import mongoose from 'mongoose';
import models from '../models/index.js';
const { FormaPagamento } = models;
export default {
    async buscar(_req, res) {
        try {
            const formas = await FormaPagamento.find().sort({ nome: 1 });
            return res.status(200).json(formas);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar formas de pagamento.',
            });
        }
    },
    async cadastrar(req, res) {
        const { nome, tipo, ativa, maxParcelas, prazoVencimentoDias, observacoes, } = req.body ?? {};
        if (typeof nome !== 'string' ||
            !nome.trim() ||
            nome.trim().length > 60) {
            return res.status(400).json({
                message: 'Informe um nome com até 60 caracteres.',
            });
        }
        if (!['credito', 'debito', 'boleto', 'pix', 'dinheiro'].includes(tipo)) {
            return res.status(400).json({
                message: 'Selecione um tipo de pagamento válido.',
            });
        }
        if (typeof ativa !== 'boolean') {
            return res.status(400).json({
                message: 'Informe se a forma de pagamento está ativa.',
            });
        }
        if (tipo === 'credito' &&
            (!Number.isSafeInteger(maxParcelas) || maxParcelas < 1)) {
            return res.status(400).json({
                message: 'Informe uma quantidade inteira de parcelas, maior que zero.',
            });
        }
        if (tipo === 'boleto' &&
            (!Number.isSafeInteger(prazoVencimentoDias) || prazoVencimentoDias < 1)) {
            return res.status(400).json({
                message: 'Informe um prazo inteiro de vencimento, maior que zero.',
            });
        }
        if (observacoes !== undefined &&
            (typeof observacoes !== 'string' || observacoes.length > 500)) {
            return res.status(400).json({
                message: 'As observações devem ter até 500 caracteres.',
            });
        }
        try {
            const forma = await FormaPagamento.create({
                nome: nome.trim(),
                tipo,
                ativa,
                maxParcelas: tipo === 'credito' ? maxParcelas : undefined,
                prazoVencimentoDias: tipo === 'boleto' ? prazoVencimentoDias : undefined,
                observacoes: observacoes?.trim() ?? '',
            });
            return res.status(201).json(forma);
        }
        catch (error) {
            if (error instanceof mongoose.mongo.MongoServerError &&
                error.code === 11000) {
                return res.status(409).json({
                    message: 'Já existe uma forma de pagamento com esse nome.',
                });
            }
            if (error instanceof mongoose.Error.ValidationError) {
                return res.status(400).json({
                    message: 'Confira os dados da forma de pagamento.',
                });
            }
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao cadastrar forma de pagamento.',
            });
        }
    },
    async editar(req, res) {
        const { id } = req.params;
        const { nome, tipo, ativa, maxParcelas, prazoVencimentoDias, observacoes, } = req.body ?? {};
        if (typeof id !== 'string' ||
            !mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'ID da forma de pagamento inválido.',
            });
        }
        if (typeof nome !== 'string' ||
            !nome.trim() ||
            nome.trim().length > 60) {
            return res.status(400).json({
                message: 'Informe um nome com até 60 caracteres.',
            });
        }
        if (!['credito', 'debito', 'boleto', 'pix', 'dinheiro'].includes(tipo)) {
            return res.status(400).json({
                message: 'Selecione um tipo de pagamento válido.',
            });
        }
        if (typeof ativa !== 'boolean') {
            return res.status(400).json({
                message: 'Informe se a forma de pagamento está ativa.',
            });
        }
        if (tipo === 'credito' &&
            (!Number.isSafeInteger(maxParcelas) || maxParcelas < 1)) {
            return res.status(400).json({
                message: 'Informe uma quantidade inteira de parcelas, maior que zero.',
            });
        }
        if (tipo === 'boleto' &&
            (!Number.isSafeInteger(prazoVencimentoDias) || prazoVencimentoDias < 1)) {
            return res.status(400).json({
                message: 'Informe um prazo inteiro de vencimento, maior que zero.',
            });
        }
        if (observacoes !== undefined &&
            (typeof observacoes !== 'string' || observacoes.length > 500)) {
            return res.status(400).json({
                message: 'As observações devem ter até 500 caracteres.',
            });
        }
        try {
            const forma = await FormaPagamento.findById(id);
            if (!forma) {
                return res.status(404).json({
                    message: 'Forma de pagamento não encontrada.',
                });
            }
            forma.nome = nome.trim();
            forma.tipo = tipo;
            forma.ativa = ativa;
            forma.observacoes = observacoes?.trim() ?? '';
            // Remove configurações que não pertencem ao tipo escolhido.
            forma.set('maxParcelas', tipo === 'credito' ? maxParcelas : undefined);
            forma.set('prazoVencimentoDias', tipo === 'boleto' ? prazoVencimentoDias : undefined);
            await forma.save();
            return res.status(200).json(forma);
        }
        catch (error) {
            if (error instanceof mongoose.mongo.MongoServerError &&
                error.code === 11000) {
                return res.status(409).json({
                    message: 'Já existe uma forma de pagamento com esse nome.',
                });
            }
            if (error instanceof mongoose.Error.ValidationError) {
                return res.status(400).json({
                    message: 'Confira os dados da forma de pagamento.',
                });
            }
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao editar forma de pagamento.',
            });
        }
    },
    async excluir(req, res) {
        const { id } = req.params;
        if (typeof id !== 'string' ||
            !mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'ID da forma de pagamento inválido.',
            });
        }
        try {
            const forma = await FormaPagamento.findByIdAndDelete(id);
            if (!forma) {
                return res.status(404).json({
                    message: 'Forma de pagamento não encontrada.',
                });
            }
            return res.status(204).send();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao excluir forma de pagamento.',
            });
        }
    },
};
//# sourceMappingURL=formaPagamentoController.js.map