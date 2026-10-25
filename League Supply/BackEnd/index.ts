import express from 'express';
const app = express();
import cors from 'cors';

import conn from './db/conn.js'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import apiRoutes from './routes/index.js'
app.use('/api', apiRoutes);

const iniciar = async () => {
    await conn();

    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    })
}

iniciar().catch(console.error);