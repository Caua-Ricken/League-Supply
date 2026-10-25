import 'dotenv/config';
import mongoose from 'mongoose';

const connectDataBase = async () => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error('MONGO_URL não foi definida no .env');
    }

    await mongoose.connect(mongoUrl);
    console.log('Conectado ao MongoDB!');
};

export default connectDataBase;