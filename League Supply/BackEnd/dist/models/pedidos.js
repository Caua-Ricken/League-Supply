import mongoose from 'mongoose';
const { Schema } = mongoose;
const Pedidos = mongoose.model('Pedidos', new Schema({
    numero: {
        type: String,
        required: true,
        unique: true,
        default: () => `LS-${new mongoose.Types.ObjectId().toHexString().toUpperCase()}`,
    },
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true,
    },
    formaPagamentoId: {
        type: Schema.Types.ObjectId,
        ref: 'FormasPagamento',
        required: true,
    },
    pagamento: {
        type: String,
        required: true,
    },
    tipoPagamento: {
        type: String,
        required: true,
        enum: ['credito', 'debito', 'boleto', 'pix', 'dinheiro'],
    },
    parcelas: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isSafeInteger,
    },
    vencimento: {
        type: Date,
    },
    observacoes: {
        type: String,
        default: '',
    },
    totalCentavos: {
        type: Number,
        required: true,
        min: 0,
        validate: Number.isSafeInteger,
    },
    itens: {
        type: [
            {
                produtoId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Produtos',
                    required: true,
                },
                nome: {
                    type: String,
                    required: true,
                },
                imagemUrl: {
                    type: String,
                    required: true,
                },
                tamanho: {
                    type: String,
                    required: true,
                },
                quantidade: {
                    type: Number,
                    required: true,
                    min: 1,
                    validate: Number.isSafeInteger,
                },
                precoCentavos: {
                    type: Number,
                    required: true,
                    min: 0,
                    validate: Number.isSafeInteger,
                },
            },
        ],
        required: true,
        validate: {
            validator: (itens) => itens.length > 0,
            message: 'O pedido precisa ter produtos.',
        },
    },
}, {
    timestamps: true,
}));
export default Pedidos;
//# sourceMappingURL=pedidos.js.map