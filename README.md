# League Supply 🏀🏈⚾🏒

Aplicação Full Stack de uma loja de artigos esportivos das ligas
NBA, NFL, MLB e NHL, com área de compras e painel administrativo.

O projeto foi desenvolvido para praticar React, TypeScript,
Node.js, Express e MongoDB, incluindo autenticação, controle
de estoque e registro de pedidos.

🔗 **[Acessar o projeto](https://league-supply-nu.vercel.app/)**

## 🎬 Demonstração

[▶ Assistir à demonstração](https://league-supply-nu.vercel.app/Video Project.mp4)

## 📌 Sobre o projeto

A League Supply reúne produtos de times das principais ligas
esportivas americanas.

A aplicação possui duas áreas: uma loja para os clientes e um
painel administrativo para gerenciar os dados e acompanhar
os pedidos registrados.

## 🛍️ Área do cliente

- Cadastro e login.
- Verificação de segurança com Cloudflare Turnstile.
- Pesquisa de produtos por nome, time e liga.
- Filtro por liga e ordenação por preço.
- Seleção de tamanho e quantidade conforme o estoque.
- Carrinho persistido no navegador por usuário.
- Escolha da forma de pagamento.
- Registro de pedidos e atualização do estoque.
- Consulta de pedidos e visualização dos detalhes.
- Encerramento da sessão e aviso de expiração.

## ⚙️ Painel administrativo

- Dashboard com indicadores da loja.
- Consulta de pedidos e detalhes das compras.
- Totais dos pedidos por forma de pagamento.
- Consulta de produtos com estoque baixo.
- Cadastro, edição e exclusão de produtos.
- Controle de estoque por tamanho ou tamanho único.
- Gerenciamento de categorias.
- Gerenciamento de usuários.
- Gerenciamento das formas de pagamento.

## 💳 Pagamentos

O checkout permite selecionar uma forma de pagamento
cadastrada e registrar suas condições no pedido.

O projeto não realiza cobranças financeiras nem possui
integração com uma operadora de pagamentos.

## 🛠️ Tecnologias

### Frontend

- React
- TypeScript
- Vite
- React Router
- Context API
- CSS
- React Icons

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- Bcrypt

### Serviços

- MongoDB Atlas — banco de dados.
- Render — hospedagem do backend.
- Vercel — hospedagem do frontend.
- Cloudflare Turnstile — verificação de segurança no login.

## 📂 Estrutura do repositório

O código está organizado nas seguintes pastas:

- `League Supply/FrontEnd`: interface da aplicação.
- `League Supply/BackEnd`: API, autenticação e acesso ao banco.
