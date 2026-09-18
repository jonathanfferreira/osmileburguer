# O Smile Burger — V2

Website estático em HTML, CSS e JavaScript para O Smile Burger, Joinville/SC.

## Desenvolvimento

Com Node.js instalado:

```sh
node scripts/build.mjs
node scripts/validate.mjs
node preview.mjs
```

Abra http://127.0.0.1:4173. Não há dependências de produção nem variáveis de ambiente.

## Estrutura

- `src/content.mjs`: produtos, ingredientes, combos, redes, `ORDER_URL`, `SITE_URL` e posições das camadas.
- `src/render.mjs`: template que entrega todo o conteúdo e SEO no HTML, sem depender de JavaScript no cliente.
- `scripts/build.mjs`: gera HTML, robots e sitemap.
- `dist/style.css`: identidade, layouts, animações e modo de movimento reduzido.
- `dist/app.js`: menu, analytics, profundidade e interação de camadas.
- `dist/assets/photos`: fotografias originais comprimidas em WebP com variantes responsivas.
- `dist/assets/burger-layers`: nove imagens independentes com transparência, substituíveis individualmente.
- `source-assets`: originais preservados fora do diretório publicado.
- `scripts/optimize-assets.py`: otimização reproduzível das fotos e remoção do fundo do logo (requer Pillow).
- `docs/V2.md`: decisões de assets, controles e evidências de verificação.

## Vercel

Importe a branch `main`, com Root Directory `./`. O `vercel.json` define build `node scripts/build.mjs`, nenhuma instalação e saída `dist`. A publicação existente é https://osmileburguer.vercel.app/.

Todos os pedidos abrem o Goomer oficial em nova aba. O arquivo `.openai/hosting.json` preserva o registro da publicação original no Sites.

## Conteúdo e controles

Edite `src/content.mjs` e execute o build. Ao trocar domínio, altere `SITE_URL` para atualizar canonical, Open Graph, JSON-LD e sitemap juntos. Ao substituir imagens das camadas, preserve os nomes e atualize suas dimensões no manifest.

No desktop, passe o mouse para explorar, clique para fixar ou arraste. No celular, arraste para cima/baixo ou toque. Teclado: Enter/Espaço alternam; setas ajustam; Home/End montam/abrem. O controle deslizante fica em um disclosure acessível. Movimento reduzido mantém toda a interação sem animação de mola, parallax ou marquee.

## Analytics

Cada evento gera `smile:analytics` e também entra em `window.dataLayer`, caso este já exista. Nenhum serviço de analytics ou rastreamento foi instalado.

Eventos: `click_order_header`, `click_order_hero`, `click_order_product`, `click_order_combo`, `click_order_footer`, `click_order_sticky`, `click_instagram`, `interaction_burger_exploded`, `open_mobile_menu`.
