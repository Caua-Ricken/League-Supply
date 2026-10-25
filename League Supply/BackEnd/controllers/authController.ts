import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import models from '../models/index.js';
const { Usuario } = models;
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado no .env');
}

export default {

    async login(req: Request, res: Response) {
        try {
            const { login, senha } = req.body;

            if (!login || !senha) {
                return res.status(400).json({
                    message: "E-mail e senha são obrigatórios",
                });
            }

            const usuario = await Usuario.findOne({
                email: login.trim().toLowerCase(),
            }).select('+senha');

            if (!usuario) {
                return res.status(404).json({
                    message: "E-mail ou senha inválidos",
                });
            }

            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (!senhaCorreta) {
                return res.status(401).json({
                    message: "E-mail ou senha inválidos",
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    role: usuario.role,
                },
                JWT_SECRET,
                {
                    expiresIn: "15m",
                }
            );

            return res.status(200).json({
                message: "Login realizado com sucesso",
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                },
            });
        } catch (error) {
            console.error("Erro ao realizar login:", error);

            return res.status(500).json({
                message: "Erro interno ao realizar login",
            });
        }
    },


    async cadastrar(req: Request, res: Response) {
        try {
            const { nome, email, senha } = req.body;

            if (
                typeof nome !== 'string' ||
                typeof email !== 'string' ||
                typeof senha !== 'string' ||
                !nome.trim() ||
                !email.trim() ||
                !senha
            ) {
                return res.status(400).json({
                    message: 'Nome, e-mail e senha são obrigatórios',
                });
            };

            const usuarioExistente = await Usuario.findOne({
                email: email.trim().toLocaleLowerCase()
            });

            if (usuarioExistente) {
                return res.status(409).json({
                    message: "Este e-mail já está cadastrado",
                });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha: senhaCriptografada,
                role: 'usuario',
            });

            return res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                usuario: {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                    role: novoUsuario.role,
                },
            });
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);

            return res.status(500).json({
                message: "Erro ao cadastrar usuário",
            });
        }
    },
}


