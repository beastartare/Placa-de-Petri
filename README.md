# Placa-de-Petri

Uma aplicação interativa de simulação de uma placa de Petri, inspirada no **Jogo da Vida**. O projeto é dividido em frontend e backend, permitindo configurar uma grade de células e acompanhar sua evolução ao longo das gerações.

## Sobre o projeto

A aplicação permite que o usuário configure o estado inicial de uma grade, definindo quais células estão vivas ou mortas. A cada geração, as células evoluem de acordo com a quantidade de vizinhas vivas, formando diferentes padrões.

O projeto é dividido em duas partes:

- **Frontend:** desenvolvido em Vue.js, responsável pela interface gráfica, interação com o usuário e visualização da simulação.
- **Backend:** desenvolvido em JavaScript, responsável pelo processamento da lógica de evolução da grade.

## Funcionalidades

- Visualização interativa da placa de Petri;
- Edição manual do estado inicial da grade;
- Ativação e desativação de células;
- Avanço manual de uma geração;
- Simulação automática das gerações;
- Pausa e retomada da simulação;
- Reinicialização da grade;
- Exibição de métricas, como geração atual e quantidade de células vivas.

## Tecnologias utilizadas

### Frontend
- Vue.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- JavaScript
- Node.js

## Regras de evolução

A evolução das células segue as regras do Jogo da Vida:

1. Uma célula viva com menos de duas vizinhas vivas morre por solidão.
2. Uma célula viva com duas ou três vizinhas vivas permanece viva.
3. Uma célula viva com mais de três vizinhas vivas morre por superpopulação.
4. Uma célula morta com exatamente três vizinhas vivas torna-se viva.

A função `evoluirGrade(grade)` recebe a grade atual, calcula o estado de cada célula considerando suas vizinhas e retorna uma nova grade correspondente à próxima geração.

As células localizadas nas bordas da grade consideram apenas as vizinhas que estão dentro dos limites da matriz.

## Estrutura do projeto

```text
Placa-de-Petri/
├── frontend/
|   ├── public/
│   │   └── favicon.ico
|   |
│   ├── src/
│   │   ├── assets/
│   │   |   ├── base.css
│   │   |   └── main.css
|   |   |
│   │   ├── components/
│   │   |   ├── Button.vue
│   │   |   ├── Grade.vue
│   │   |   └── Metrics.vue
|   |   |
│   │   ├── services/
│   │   |   └── jogoService.js
|   |   |
│   │   ├── App.vue
│   │   └── main.js
|   |
│   ├── index.html
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── backend/
|   |── routes/
│   │   └── jogo.js
|   |
│   ├── services/
│   │   └── jogoService.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## Como executar o projeto

### Pré-requisitos

- Node.js
- npm

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd Placa-de-Petri
```

### 2. Executar o Backend

Acesse o diretório do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

### 3. Executar o Frontend

Em outro terminal, acesse o diretório do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Gere a versão de produção:

```bash
npm run build
```

## Como utilizar

1. Acesse a aplicação pelo navegador.
2. Configure a grade inicial, ativando ou desativando células.
3. Avance uma geração manualmente ou inicie a simulação automática.
4. Pause a simulação para observar os padrões formados.
5. Reinicie a grade para iniciar uma nova configuração.