import mongoose from 'mongoose';
const { Schema } = mongoose;

const FormasPagamento = mongoose.model(
  'FormasPagamento',
  new Schema({
    nome: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 60,
    },

    tipo: {
      type: String,
      enum: ['credito', 'debito', 'boleto', 'pix', 'dinheiro'],
      required: true,
    },

    ativa: {
      type: Boolean,
      required: true,
      default: true,
    },

    maxParcelas: {
      type: Number,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: 'Informe uma quantidade inteira de parcelas.',
      },
      required: function (this: { tipo: string }): boolean {
        return this.tipo === 'credito';
      },
    },

    prazoVencimentoDias: {
      type: Number,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: 'Informe uma quantidade inteira de dias.',
      },
      required: function (this: { tipo: string }): boolean {
        return this.tipo === 'boleto';
      },
    },

    observacoes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  }, {
    timestamps: true,
  })
);

export default FormasPagamento;