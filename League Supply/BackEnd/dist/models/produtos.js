import mongoose from 'mongoose';
const { Schema } = mongoose;
const Produtos = mongoose.model('Produtos', new Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    liga: {
        type: String,
        enum: ['NFL', 'MLB', 'NHL', 'NBA'],
        required: true,
    },
    timeId: {
        type: String,
        required: true,
        trim: true,
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
    },
    precoCentavos: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isSafeInteger,
            message: 'Informe o preço em centavos inteiros',
        },
    },
    imagemUrl: {
        type: String,
        required: true,
        trim: true,
    },
    variantes: {
        type: [{
                _id: false,
                tamanho: {
                    type: String,
                    required: true,
                    trim: true,
                },
                estoque: {
                    type: Number,
                    required: true,
                    min: 0,
                    validate: {
                        validator: Number.isSafeInteger,
                        message: 'O estoque deve ser um número inteiro',
                    },
                },
            }],
        validate: {
            validator: (itens) => itens.length > 0 &&
                new Set(itens.map(item => item.tamanho)).size === itens.length,
            message: 'Informe os tamanhos sem repetições',
        },
    },
    ativo: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
}));
export default Produtos;
//# sourceMappingURL=produtos.js.map