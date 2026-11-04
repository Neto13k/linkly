# Linkly — Encurtador de URLs

**Linkly** é uma aplicação web full-stack para criar, organizar e compartilhar links curtos personalizados. Cada usuário possui seu próprio espaço de links, pode acompanhar a quantidade de acessos e gerenciar seus endereços por meio de um painel autenticado.

O projeto foi desenvolvido como uma aplicação prática de portfólio, integrando **React, TypeScript, Node.js, Express e PostgreSQL**, com frontend e API publicados separadamente.

## Acesse o projeto

| Recurso | Endereço |
| --- | --- |
| **Aplicação web** | [linklyhub.vercel.app](https://linklyhub.vercel.app/) |
| Login | [linklyhub.vercel.app/login](https://linklyhub.vercel.app/login) |
| Cadastro | [linklyhub.vercel.app/register](https://linklyhub.vercel.app/register) |
| Regras para criar links | [linklyhub.vercel.app/regras](https://linklyhub.vercel.app/regras) |
| **API (backend)** | [linkly-6goz.onrender.com](https://linkly-6goz.onrender.com) |
| Saúde da API e do banco | [linkly-6goz.onrender.com/api/health](https://linkly-6goz.onrender.com/api/health) |

> Os links encurtados são servidos **pelo domínio do backend no Render**, não pelo domínio da Vercel. Em hospedagens gratuitas, o primeiro acesso após um período de inatividade pode demorar mais.

## Funcionalidades

- Cadastro e login com e-mail e senha.
- Autenticação por **JWT**, com expiração de 1 hora.
- Rotas de painel e perfil protegidas no frontend; validação do token nas operações protegidas da API.
- Criação de URLs curtas com **slug personalizado** no formato `/:username/:slug`.
- Listagem, edição e exclusão dos próprios links, com confirmação antes da exclusão.
- Redirecionamento público para a URL original.
- Contador de acessos por link, consultado ao carregar ou atualizar o Dashboard.
- Botão para copiar a URL encurtada, com retorno visual de sucesso ou falha.
- Consulta pública às regras de criação de links.
- Perfil com visualização dos dados, atualização de e-mail mediante confirmação e exclusão da conta.
- Interface estilizada com **SCSS**, layouts responsivos e suporte à preferência de tema claro/escuro do sistema.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript 6, Vite 8, React Router 8 |
| Estilos | Sass / SCSS |
| Backend | Node.js, Express 5, JavaScript (ES Modules) |
| Banco de dados | PostgreSQL, biblioteca `pg` |
| Autenticação | JSON Web Token (`jsonwebtoken`) e `bcrypt` |
| Ferramentas de desenvolvimento | ESLint, Nodemon, Vitest e Supertest (dependências de teste) |
| Hospedagem | Vercel (frontend), Render (API) e Neon (PostgreSQL) |

## Como funciona

```text
Navegador
   |
   v
Frontend React / Vercel
   |  requisições /api/*
   v
Rewrite da Vercel ---> API Express / Render ---> PostgreSQL / Neon

URL curta pública: https://linkly-6goz.onrender.com/:username/:slug
   |
   v
API consulta o link, incrementa os cliques e redireciona ao destino
```

No desenvolvimento local, o Vite encaminha `/api` para `http://localhost:4000`. Em produção, a mesma rota é encaminhada ao Render pelas regras de `frontend/vercel.json`. A URL usada para compartilhar links é definida pela variável `VITE_SHORT_URL_BASE`.

### Exemplo de utilização

Um usuário chamado `exemplo` pode cadastrar:

- **Slug:** `meu-github`
- **Destino:** `https://github.com/`
- **Link gerado:** `https://linkly-6goz.onrender.com/exemplo/meu-github`

O endereço acima é **ilustrativo**: ele só funcionará se existir um usuário e um link com esses identificadores no banco.

## Regras de criação

### Nome de usuário

- Entre **3 e 30 caracteres**.
- Apenas letras minúsculas (`a-z`), números e hífens.
- Não pode começar ou terminar com hífen, nem conter hífens consecutivos.
- Deve ser único e não pode estar na lista de nomes reservados.
- Um nome de usuário excluído é adicionado à lista de nomes bloqueados e não pode ser reutilizado.

### Slug

- Entre **4 e 30 caracteres**.
- Apenas letras minúsculas, números e hífens, com as mesmas restrições de posicionamento do hífen.
- Deve ser único **dentro da conta do usuário**; usuários diferentes podem utilizar o mesmo slug.

Exemplos válidos: `github`, `meu-portfolio`, `projeto123`. Exemplos inválidos: `Face`, `abc`, `meu link`, `meu--link`.

### URL de destino

- Deve ser uma URL válida com protocolo `http://` ou `https://`.
- Comprimento máximo de **2.048 caracteres**.
- Não pode conter espaços ou outros caracteres de espaço em branco no endereço normalizado.

### Senha no cadastro

- Mínimo de **8 caracteres**.
- Pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial.
- Os caracteres especiais aceitos pela validação atual são: `@ $ ! % * ? &`.
- A expressão regular atual permite letras, números e esses caracteres especiais, não outros símbolos.

## Estrutura do repositório

```text
linkly/
├── Backend/
│   ├── server.js                # Inicialização do servidor
│   ├── .env.example             # Variáveis locais de exemplo
│   ├── package.json
│   └── src/
│       ├── app.js              # App Express, rotas e health check
│       ├── controllers/         # Requisições e validações
│       ├── services/            # Consultas SQL e regras de dados
│       ├── routes/              # Endpoints da API
│       ├── middlewares/         # JWT e tratamento de erros
│       └── db/
│           ├── db.js           # Pool de conexões PostgreSQL
│           └── Schema.sql      # Estrutura e dados iniciais
├── frontend/
│   ├── public/                  # Recursos estáticos
│   ├── src/
│   │   ├── pages/              # Login, Register, Dashboard, Profile, Regras
│   │   ├── components/         # ProtectedRoute, CopyLinkButton
│   │   ├── hooks/              # useSessionError, useClipboard
│   │   ├── services/           # Comunicação HTTP e sessão
│   │   ├── types/              # Interfaces TypeScript
│   │   └── styles/             # SCSS global e parciais
│   ├── .env.example
│   ├── vite.config.ts           # Proxy local /api
│   ├── vercel.json              # Rewrite da API e fallback SPA
│   └── package.json
└── README.md
```

## Executando localmente

### Pré-requisitos

- **Node.js 22.22.0 ou superior**, preferencialmente uma versão LTS compatível com as dependências do projeto (o React Router 8.5.1 requer pelo menos 22.22.0).
- npm.
- PostgreSQL instalado e acessível, ou uma instância PostgreSQL remota.
- Git, para clonar o repositório.

### 1. Clonar

```bash
git clone https://github.com/Neto13k/linkly.git
cd linkly
```

### 2. Preparar o banco de dados

Crie um banco chamado `linkly` no PostgreSQL local (por exemplo, pelo **pgAdmin**) e execute o arquivo:

`Backend/src/db/Schema.sql`

Se estiver usando `psql`, a partir da raiz do repositório, depois de criar o banco:

```bash
psql -d linkly -f Backend/src/db/Schema.sql
```

O script cria as tabelas `users`, `links` e `blocked_names`, além de inserir os nomes reservados. **Execute o script apenas uma vez em um banco vazio**, pois ele utiliza `CREATE TABLE` sem `IF NOT EXISTS`.

### 3. Configurar o backend

Entre na pasta `Backend`, instale as dependências e crie um arquivo `.env` a partir de `.env.example`:

```bash
cd Backend
npm ci
cp .env.example .env
```

No Windows PowerShell, utilize `Copy-Item .env.example .env` no lugar de `cp`, se necessário.

Preencha o arquivo `Backend/.env` com os seus dados locais:

```dotenv
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=linkly
DB_USER=SEU_USUARIO_POSTGRES
DB_PASSWORD=SUA_SENHA_POSTGRES
JWT_SECRET=UMA_CHAVE_LONGA_ALEATORIA
```

A conexão também suporta `DATABASE_URL`: **quando essa variável existe, ela tem prioridade sobre as variáveis `DB_*`**. Para uma instância remota, use a string de conexão fornecida pelo provedor, preservando seus parâmetros de SSL/TLS.

Inicie o backend:

```bash
npm run dev
```

A API estará disponível em `http://localhost:4000`. Verifique a conexão pelo endpoint `http://localhost:4000/api/health`.

### 4. Configurar o frontend

Abra outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

No Windows PowerShell, utilize `Copy-Item .env.example .env` se necessário.

O arquivo `frontend/.env` deverá conter:

```dotenv
VITE_SHORT_URL_BASE=http://localhost:4000
```

Acesse **http://localhost:3000**. O frontend utiliza o proxy do Vite para direcionar requisições `/api` ao backend local na porta `4000`.

> **Atenção:** `JWT_SECRET`, `DATABASE_URL` e senhas de banco são segredos do servidor. Não os coloque em variáveis `VITE_*`, no código-fonte ou em commits. Os arquivos `.env` estão ignorados pelo Git.

## Referência da API

**Base local:** `http://localhost:4000`  
**Base de produção:** `https://linkly-6goz.onrender.com`

As rotas protegidas exigem `Authorization: Bearer SEU_TOKEN_JWT`.

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Não | Consulta o estado da API e a conexão com o banco |
| `POST` | `/api/auth/register` | Não | Registra usuário e retorna JWT e dados públicos |
| `POST` | `/api/auth/login` | Não | Autentica e retorna JWT e dados públicos |
| `GET` | `/api/users/:id` | Sim | Consulta o próprio perfil |
| `PUT` | `/api/users/:id` | Sim | Atualiza o próprio e-mail |
| `DELETE` | `/api/users/:id` | Sim | Exclui a própria conta e seus links |
| `GET` | `/api/links/user/:userId` | Sim | Lista os links do usuário |
| `GET` | `/api/links/:id` | Sim | Consulta um link do usuário |
| `POST` | `/api/links` | Sim | Cria um link |
| `PUT` | `/api/links/:id` | Sim | Atualiza slug e destino |
| `DELETE` | `/api/links/:id` | Sim | Exclui um link |
| `GET` | `/:username/:slug` | Não | Incrementa cliques e redireciona ao destino |

### Corpos de requisição

**Cadastro** — `POST /api/auth/register`:

```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "Senha@123"
}
```

**Login** — `POST /api/auth/login`:

```json
{
  "email": "usuario@example.com",
  "password": "Senha@123"
}
```

**Criar/editar link** — `POST /api/links` ou `PUT /api/links/:id`:

```json
{
  "slug": "meu-github",
  "destinationUrl": "https://github.com/"
}
```

**Atualizar e-mail** — `PUT /api/users/:id`:

```json
{
  "email": "novo-email@example.com"
}
```

O backend retorna **JSON** nas operações de API; respostas de erro podem incluir `message` ou `error`, conforme a rota/middleware. O redirecionamento público utiliza uma resposta HTTP de redirecionamento, não JSON, quando o link existe.

## Modelo de dados

| Tabela | Responsabilidade |
| --- | --- |
| `users` | Dados de conta, e-mail, hash da senha e data de criação |
| `links` | Slug, URL de destino, contador, data de criação e vínculo com o usuário |
| `blocked_names` | Nomes reservados que não podem ser utilizados em novos cadastros |

O campo `links.user_id` referencia `users.id` com `ON DELETE CASCADE`: ao excluir uma conta, seus links também são removidos. A combinação `(user_id, slug)` possui uma restrição de unicidade. As constraints do banco complementam as validações feitas na API.

## Deploy

A publicação atual utiliza três serviços:

### Banco de dados — Neon

- PostgreSQL hospedado no **Neon**.
- Branch utilizada: `production`; banco: `neondb`.
- Estrutura criada executando `Backend/src/db/Schema.sql` no SQL Editor.
- A string de conexão é mantida **somente** na variável privada `DATABASE_URL` do backend.

### API — Render

- Repositório: [Neto13k/linkly](https://github.com/Neto13k/linkly).
- Tipo de serviço: **Web Service / Node**.
- Diretório raiz (**Root Directory**): `Backend`.
- Comando de build: `npm install`.
- Comando de inicialização: `npm start` (`node server.js`).
- Região utilizada: Virginia (US East).
- Variáveis necessárias: `DATABASE_URL` e `JWT_SECRET`; `NODE_ENV=production` é recomendado. O Render pode definir `PORT` automaticamente.
- URL: **https://linkly-6goz.onrender.com**.

### Frontend — Vercel

- Framework: **Vite**.
- Diretório raiz (**Root Directory**): `frontend`.
- Build: `npm run build`.
- Diretório de saída: `dist`.
- Variável de ambiente:

```dotenv
VITE_SHORT_URL_BASE=https://linkly-6goz.onrender.com
```

- URL: **https://linklyhub.vercel.app**.
- O arquivo `frontend/vercel.json` encaminha `/api/:path*` ao backend no Render e utiliza `/index.html` como fallback para as rotas do React Router.

> Se mudar o endereço do backend, atualize tanto `VITE_SHORT_URL_BASE` nas configurações da Vercel quanto a regra de rewrite em `frontend/vercel.json`. Uma mudança apenas no domínio do frontend não altera a URL dos links encurtados existentes.

## Segurança e decisões de implementação

- Senhas armazenadas como **hash bcrypt**, nunca em texto puro no banco.
- Token JWT assinado no backend, com validade de **1 hora**.
- Sessão do frontend armazenada em `sessionStorage`; o logout remove token e dados de usuário.
- Rotas protegidas da API validam o token; operações de leitura, alteração e exclusão conferem a identidade do usuário.
- Consultas PostgreSQL parametrizadas, reduzindo riscos de SQL Injection.
- Validações de entradas e restrições no banco para slugs, usuários, URLs e unicidade.
- Exclusões e atualização de e-mail possuem confirmações na interface; na exclusão de conta, links são removidos em cascata e o username é reservado.

**Escopo atual:** este é um MVP de portfólio. Ainda não há verificação de propriedade do e-mail, recuperação/alteração de senha, proteção específica contra tentativas excessivas de login ou uma solução completa de prevenção de abuso de URLs. Não deve ser apresentado como um serviço de produção com segurança corporativa.

## Comandos e verificações

No diretório `frontend`:

```bash
npm run dev       # Ambiente local com Vite
npm run build     # Checagem TypeScript e build de produção
npm run lint      # Análise com ESLint
npm run preview   # Visualiza o build gerado
```

No diretório `Backend`:

```bash
npm run dev       # Inicia com Nodemon
npm start         # Inicia com Node.js
npm test          # Executa Vitest
```

**Nota sobre testes:** o script atual do backend utiliza `vitest run --passWithNoTests`, e o repositório enviado não contém uma suíte de testes automatizados. Por isso, executar `npm test` sem falhas **não significa** que existam testes cobrindo as funcionalidades. Antes de uma entrega, recomenda-se executar build/lint e conferir manualmente cadastro, login, CRUD, cópia, redirecionamento, contador e perfil.

## Limitações e melhorias futuras

- O número de cliques é atualizado no Dashboard **ao carregar/recarregar a página**, não em tempo real.
- Recuperação de senha por e-mail e alteração de senha ainda não foram implementadas.
- Verificação de e-mail e controles adicionais de segurança ficam para versões futuras.
- Os links curtos dependem do domínio da API no Render; não existe um domínio curto próprio configurado nesta versão.
- Testes automatizados e pipeline de integração contínua são possíveis melhorias posteriores.

## Autor e repositório

Projeto de portfólio desenvolvido por [Neto13k](https://github.com/Neto13k).

**Código-fonte:** [github.com/Neto13k/linkly](https://github.com/Neto13k/linkly)
