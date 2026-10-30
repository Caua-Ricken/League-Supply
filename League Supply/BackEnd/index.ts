import express from 'express';
const app = express();
import cors from 'cors';
const porta = Number(process.env.PORT) || 3000;

import conn from './db/conn.js'

app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import apiRoutes from './routes/index.js'
app.use('/api', apiRoutes);

const iniciar = async () => {
    await conn();

    app.listen(porta, '0.0.0.0', () => {
        console.log(`Servidor iniciado na porta ${porta}`);
    });
}

iniciar().catch(console.error);