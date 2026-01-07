# 🌤️ GDASH Frontend

Frontend do **GDASH** — um dashboard moderno para visualização, análise e insights de dados climáticos, consumindo uma **API distribuída em produção**.

Este projeto faz parte de um ecossistema **full‑stack orientado a eventos**, onde o frontend é responsável apenas pela **experiência do usuário e visualização dos dados**.

---

## 🚀 Projeto em Produção

🔗 **URL pública:**

```
https://desafio-gdash-front.vercel.app
```

🔗 **API Backend (Render):**

```
https://desafio-gdash-public.onrender.com
```

---

## 🧱 Stack Utilizada

* **React 19**
* **Vite**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **React Router DOM**
* **TanStack React Query**
* **Axios**
* **Recharts**
* **Framer Motion**

Hospedagem:

* **Vercel** (produção)

---

## 📊 Funcionalidades

* 🔐 Autenticação via JWT
* 🌎 Consulta climática por cidade
* 📈 Dashboard com métricas agregadas
* 📋 Tabela de histórico climático
* 📤 Exportação de dados (XLSX)
* 🤖 Exibição de insights gerados por IA
* 🎨 Interface moderna, responsiva e animada

---

## 🔄 Integração com Backend

O frontend consome uma **API REST** hospedada no Render, que por sua vez utiliza:

* RabbitMQ (CloudAMQP)
* Python (coletor de clima)
* Go (worker de processamento)
* MongoDB Atlas

Fluxo resumido:

```
Usuário → Frontend (Vercel)
        → API NestJS (Render)
        → RabbitMQ (CloudAMQP)
        → Python Collector
        → Go Worker
        → MongoDB
```

---

## 🔐 Variáveis de Ambiente

As variáveis devem começar com `VITE_`.

### `.env.development`

```env
VITE_API_URL=https://desafio-gdash-public.onrender.com
VITE_GEMINI_KEY=YOUR_GEMINI_KEY
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_KEY
```

No **Vercel**, essas variáveis são configuradas diretamente no painel do projeto.

---

## 🧪 Rodando Localmente

### Pré‑requisitos

* Node.js 18+
* pnpm

### Instalação

```bash
pnpm install
```

### Ambiente de desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## 📦 Build de Produção

```bash
pnpm run build
```

Os arquivos finais serão gerados na pasta:

```
dist/
```

---

## ☁️ Deploy

O deploy é feito automaticamente pela **Vercel** a partir da branch `main` do GitHub.

Configuração utilizada:

* Framework: **Vite**
* Package Manager: **pnpm**
* Build Command: `pnpm run build`
* Output Directory: `dist`
* Root Directory: `gdash-front`

---

## 🎯 Objetivo do Projeto

Demonstrar:

* Integração frontend ↔ backend em produção
* Consumo de APIs distribuídas
* Boas práticas com React moderno
* Arquitetura escalável e desacoplada
* Dashboard real com dados dinâmicos

Projeto ideal para **portfólio profissional** e avaliação técnica.

---

## 👨‍💻 Autor

**Josadaque Ferreira (J Dack)**

* GitHub: [https://github.com/Josadack](https://github.com/Josadack)
* LinkedIn: [https://www.linkedin.com/in/josadaque-ferreira](https://www.linkedin.com/in/josadaque-ferreira)

---

⭐ Se este projeto te ajudou ou te inspirou, deixe uma estrela no repositório!
