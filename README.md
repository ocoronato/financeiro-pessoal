# Financeiro Pessoal

Aplicativo de controle financeiro pessoal. Roda 100% no navegador — todos os dados ficam salvos localmente (IndexedDB), sem backend, login ou envio de dados a servidores externos.

## Rodando o projeto

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Gerando a versão de produção (PWA)

```bash
npm run build
npm run preview
```

O `build` gera os arquivos em `dist/`, incluindo o service worker e o manifesto do PWA. Só na versão de produção (`build`/`preview`) o app fica instalável e funciona offline — no modo `dev` o PWA fica desativado de propósito, para não conflitar com o hot reload.

Para instalar:

- **Chrome/Edge (desktop ou Android):** ícone de instalar na barra de endereço, ou menu → "Instalar app".
- **iPhone/iPad (Safari):** botão de compartilhar → "Adicionar à Tela de Início".

## Backup

Seus dados vivem apenas neste navegador/dispositivo. Em **Configurações → Backup e exportação**, exporte o arquivo `financeiro-backup.json` periodicamente — é a única forma de recuperar os dados caso o navegador seja resetado ou o dispositivo trocado.

## Stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui (componentes próprios em `src/components/ui`), Dexie.js (IndexedDB), Recharts.
