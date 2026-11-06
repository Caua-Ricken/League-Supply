import { mkdirSync, appendFileSync } from 'node:fs';
import path from 'node:path';

const pastaLogs = path.resolve('logs');

mkdirSync(pastaLogs, { recursive: true });

export function registrarLog(mensagem: string) {
  const agora = new Date();

  const dia = agora.toISOString().slice(0, 10);
  const arquivo = path.join(pastaLogs, `${dia}.log`);

  const linha = `[${agora.toISOString()}] ${mensagem}\n`;

  appendFileSync(arquivo, linha, 'utf8');

  console.log(linha.trim());
}