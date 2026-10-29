import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

import models from '../models/index.js';

const { Pedidos, Produtos, FormaPagamento } = models;

interface RequestAutenticado extends Request {
  usuario?: string | JwtPayload;
}

interface ItemCompra {
  produtoId: string;
  tamanho: string;
  quantidade: number;
}

// Permite informar o código HTTP dos erros da compra.
class ErroCompra extends Error {
  constructor(
    mensagem: string,
    public status: number
  ) {
    super(mensagem);
  }
}

export default {
  async cadastrar(req: RequestAutenticado, res: Response) {
    const usuario = req.usuario;

    if (
      !usuario ||
      typeof usuario === 'string' ||
      typeof usuario.id !== 'string' ||
      !mongoose.isObjectIdOrHexString(usuario.id)
    ) {
      return res.status(401).json({
        message: 'Faça login para finalizar o pedido.',
      });
    }

    const { itens, formaPagamentoId, parcelas } = req.body ?? {};

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        message: 'Adicione produtos ao carrinho.',
      });
    }

    if (
      typeof formaPagamentoId !== 'string' ||
      !mongoose.isObjectIdOrHexString(formaPagamentoId)
    ) {
      return res.status(400).json({
        message: 'Forma de pagamento inválida.',
      });
    }

    for (const item of itens) {
      if (
        !item ||
        typeof item.produtoId !== 'string' ||
        !mongoose.isObjectIdOrHexString(item.produtoId) ||
        typeof item.tamanho !== 'string' ||
        !item.tamanho.trim() ||
        !Number.isSafeInteger(item.quantidade) ||
        item.quantidade < 1
      ) {
        return res.status(400).json({
          message: 'Confira os produtos e as quantidades.',
        });
      }
    }

    try {
      const pedido = await mongoose.connection.transaction(
        async session => {
          const forma = await FormaPagamento.findById(
            formaPagamentoId
          ).session(session);

          if (!forma || !forma.ativa) {
            throw new ErroCompra(
              'Forma de pagamento indisponível.',
              400
            );
          }

          let quantidadeParcelas = 1;

          if (forma.tipo === 'credito') {
            quantidadeParcelas = parcelas;

            if (
              !Number.isSafeInteger(quantidadeParcelas) ||
              quantidadeParcelas < 1 ||
              quantidadeParcelas > (forma.maxParcelas ?? 1)
            ) {
              throw new ErroCompra(
                'Quantidade de parcelas inválida.',
                400
              );
            }
          }

          let vencimento: Date | undefined;

          if (forma.tipo === 'boleto') {
            const dias = forma.prazoVencimentoDias;

            if (
              typeof dias !== 'number' ||
              !Number.isSafeInteger(dias) ||
              dias < 1
            ) {
              throw new ErroCompra(
                'O prazo do boleto não está configurado.',
                400
              );
            }

            vencimento = new Date();
            vencimento.setDate(vencimento.getDate() + dias);
          }

          const itensPedido = [];
          let totalCentavos = 0;

          for (const item of itens as ItemCompra[]) {
            const produto = await Produtos.findById(
              item.produtoId
            ).session(session);

            if (!produto || !produto.ativo) {
              throw new ErroCompra(
                'Um dos produtos está indisponível.',
                409
              );
            }

            const variante = produto.variantes.find(
              variante => variante.tamanho === item.tamanho
            );

            if (!variante || variante.estoque < item.quantidade) {
              throw new ErroCompra(
                `Estoque insuficiente para ${produto.nome}, tamanho ${item.tamanho}.`,
                409
              );
            }

            itensPedido.push({
              produtoId: produto._id,
              nome: produto.nome,
              imagemUrl: produto.imagemUrl,
              tamanho: item.tamanho,
              quantidade: item.quantidade,
              precoCentavos: produto.precoCentavos,
            });

            totalCentavos +=
              produto.precoCentavos * item.quantidade;

            variante.estoque -= item.quantidade;

            await produto.save({ session });
          }

          const pedido = new Pedidos({
            usuarioId: usuario.id,
            formaPagamentoId: forma._id,
            pagamento: forma.nome,
            tipoPagamento: forma.tipo,
            parcelas: quantidadeParcelas,
            vencimento,
            observacoes: forma.observacoes ?? '',
            totalCentavos,
            itens: itensPedido,
          });

          await pedido.save({ session });

          return pedido;
        }
      );

      return res.status(201).json(pedido);
    } catch (error) {
      if (error instanceof ErroCompra) {
        return res.status(error.status).json({
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Não foi possível finalizar o pedido.',
      });
    }
  },

  async buscarMeus(req: RequestAutenticado, res: Response) {
    const usuario = req.usuario;

    if (
      !usuario ||
      typeof usuario === 'string' ||
      typeof usuario.id !== 'string' ||
      !mongoose.isObjectIdOrHexString(usuario.id)
    ) {
      return res.status(401).json({
        message: 'Faça login para consultar seus pedidos.',
      });
    }

    try {
      const pedidos = await Pedidos.find({
        usuarioId: usuario.id,
      }).sort({ createdAt: -1 });

      return res.status(200).json(pedidos);
    } catch {
      return res.status(500).json({
        message: 'Não foi possível buscar seus pedidos.',
      });
    }
  },

}