import mongoose from 'mongoose';
const { Schema } = mongoose;
const Usuario = mongoose.model('Usuarios', new Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario',
        required: true,
    },
}, {
    timestamps: true,
}));
export default Usuario;
//# sourceMappingURL=usuario.js.map