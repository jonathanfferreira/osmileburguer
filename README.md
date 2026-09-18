# O Smile Burger

Primeira versão do website da O Smile Burger, Joinville/SC. Site estático em HTML, CSS e JavaScript, com as fotografias e o logotipo originais da marca.

## Publicar na Vercel

Importe este repositório e selecione a branch `main`. Mantenha o Root Directory na raiz do repositório (`./`). O arquivo `vercel.json` configura o projeto como estático, sem instalação ou build, e publica a pasta `dist`.

Não são necessárias variáveis de ambiente. Todos os CTAs de compra direcionam ao Goomer.

## Desenvolvimento local

Com Node.js instalado, execute:

```sh
node preview.mjs
```

Acesse `http://127.0.0.1:4173`.

## Arquivos principais

- `dist/index.html`: documento, metadados e hero.
- `dist/style.css`: identidade visual, layouts responsivos e animações.
- `dist/app.js`: produtos, combos, configurações, links e interações.
- `dist/assets/`: fotografias e logotipo utilizados no site.
- `vercel.json`: configuração de publicação na Vercel.

O endereço de pedidos fica na constante `ORDER_URL`. Os dados ficam em `products`, `combos` e `siteSettings`. Os cliques disparam eventos `smile:analytics`; se existir um `window.dataLayer`, os eventos também são enviados a ele.

A experiência de camadas usa recortes da fotografia original. A estrutura `burgerLayers` está preparada para receber imagens individuais de ingredientes posteriormente.

O arquivo `.openai/hosting.json` registra a publicação original no Sites e não é necessário para a Vercel.
