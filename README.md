# Craque do Jogo

**Sua Carreira. Seu Legado.**

Monorepo inicial do simulador de carreira de futebol, baseado no GDD v0.3.

## O que já existe nesta primeira base

- Aplicação web com Next.js.
- Aplicação mobile com Expo / React Native.
- Pacote `game-engine` independente das interfaces.
- Tipos compartilhados para atleta, clube e carreira.
- Cálculo inicial de Overall por posição.
- Geração de três propostas iniciais com pesos por origem.
- Interface demonstrativa para gerar um atleta e visualizar propostas.

> Esta é a fundação técnica e o primeiro protótipo de criação de carreira. Ainda não implementa temporadas completas, simulação de partidas, banco de dados ou autenticação.

## Requisitos

- Node.js 22.13 ou superior.
- npm atualizado.
- VS Code.
- Expo Go no celular (ou emulador Android).

## Instalação

Na pasta raiz do projeto:

```bash
npm install
```

## Executar a versão web

```bash
npm run dev:web
```

Abra http://localhost:3000.

## Executar a versão mobile

```bash
npm run dev:mobile
```

Leia o QR Code com o Expo Go. Para Android, também é possível pressionar `a` no terminal com um emulador configurado.

## Verificações

```bash
npm run typecheck
npm run test:engine
npm run build:web
```

## Estrutura

```text
apps/
  web/                 # Next.js / Vercel
  mobile/              # Expo / React Native
packages/
  game-engine/         # Regras puras do jogo
  shared/              # Tipos compartilhados
docs/
  ROADMAP.md
```

## Publicar na Vercel

Importe o repositório GitHub na Vercel e configure:

- Root Directory: `.` (raiz do monorepo)
- Framework Preset: Next.js
- Build Command: `npm run build:web`
- Install Command: `npm install`

A aplicação web fica em `apps/web`, mas o build é iniciado pela raiz para resolver os workspaces.

## Próxima etapa

Validar esta fundação no computador e então construir a tela de criação do atleta com todos os campos do GDD: nome, nacionalidade, idade, altura, peso, pé dominante, posição, arquétipo e origem.
