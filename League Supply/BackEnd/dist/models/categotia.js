import mongoose from 'mongoose';
const { Schema } = mongoose;
const Categorias = mongoose.model('Categorias', new Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
        unique: true,
    },
}, {
    timestamps: true,
}));
export default Categorias;
//# sourceMappingURL=categotia.js.map