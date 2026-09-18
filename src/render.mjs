import { ORDER_URL, SITE_URL, siteSettings, products, combos, burgerLayers, photoPositions } from './content.mjs';
import { readFileSync } from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../dist/assets/image-manifest.json',import.meta.url),'utf8'));
const layerManifest=JSON.parse(readFileSync(new URL('../dist/assets/burger-layers/manifest.json',import.meta.url),'utf8'));
const image=(slug,alt,{sizes='(max-width: 700px) 88vw, 36vw',className='',loading='lazy'}={})=>{
  const item=manifest[slug];
  return `<img class="${className}" src="${item.variants.at(-1).file}" srcset="${item.variants.map(v=>`${v.file} ${v.width}w`).join(', ')}" sizes="${sizes}" width="${item.width}" height="${item.height}" alt="${alt}" loading="${loading}" decoding="async" style="object-position:${photoPositions[slug]}">`;
};
const icon=(name,extra='')=>{
  const paths={
    arrow:'<path d="M6 18 18 6M8 6h10v10"/>',
    down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
    up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
    drag:'<path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5"/>',
    sparkle:'<path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"/>',
    burst:'<path d="M12 2c0 7-3 10-10 10 7 0 10 3 10 10 0-7 3-10 10-10-7 0-10-3-10-10Z" fill="currentColor" stroke="none"/>',
    star:'<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z" fill="currentColor" stroke="none"/>'
  };
  return `<svg class="icon icon-${name} ${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};
const arrow=`<span class="button-arrow" aria-hidden="true">${icon('arrow')}</span>`;
const order=(text,place,extra='',product='')=>`<a class="button ${extra}" href="${ORDER_URL}" target="_blank" rel="noopener noreferrer" data-order="${place}"${product?` data-product="${product}"`:''}><span class="button-text">${text}</span>${arrow}</a>`;
const logo=(footer=false)=>`<a class="logo" href="#inicio" aria-label="O Smile Burger, ${footer?'voltar ao início':'início'}"><img src="assets/brand/logo.webp" alt="O Smile Burger" width="446" height="197" decoding="async"></a>`;
const heading=(content)=>`<span class="heading-mask"><span>${content}</span></span>`;
const marqueeText=`BURGER <span>${icon('sparkle')}</span> SMILE <span>${icon('sparkle')}</span> FRIES <span>${icon('sparkle')}</span> DELIVERY <span>${icon('sparkle')}</span> `;
export function renderSite(){
const schema={'@context':'https://schema.org','@type':'Restaurant','@id':`${SITE_URL}#restaurant`,name:siteSettings.name,url:SITE_URL,image:`${SITE_URL}assets/og-smile.jpg`,logo:`${SITE_URL}assets/brand/logo.png`,address:{'@type':'PostalAddress',addressLocality:'Joinville',addressRegion:'SC',addressCountry:'BR'},servesCuisine:'Hambúrgueres artesanais',hasMenu:ORDER_URL,sameAs:[siteSettings.socialLinks.instagram],openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'19:00',closes:'23:00'}]};
return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffdb00">
  <title>O Smile Burger — Um sorriso a cada mordida</title>
  <meta name="description" content="Burgers artesanais, combos e bons motivos pra sorrir. O Smile Burger em Joinville. Peça pelo Goomer, de segunda a sexta, das 19h às 23h.">
  <link rel="canonical" href="${SITE_URL}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="O Smile Burger">
  <meta property="og:title" content="Tá rachando o bico de fome? Então pede um Smile.">
  <meta property="og:description" content="Burgers artesanais em Joinville. Um sorriso a cada mordida. Delivery de segunda a sexta, 19h–23h.">
  <meta property="og:url" content="${SITE_URL}">
  <meta property="og:image" content="${SITE_URL}assets/og-smile.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="O Smile Burger: tá rachando o bico de fome? Burger Gargalhada e identidade original da marca.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="O Smile Burger — Tá rachando o bico de fome?">
  <meta name="twitter:description" content="Burgers artesanais, combos e sorrisos. Joinville – SC.">
  <meta name="twitter:image" content="${SITE_URL}assets/og-smile.jpg">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/brand/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Lilita+One&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>
  <script defer src="app.js"></script>
</head>
<body>
<a class="skip" href="#favoritos">Pular para o conteúdo</a>
<header id="header">
  ${logo()}
  <nav aria-label="Navegação principal"><a href="#favoritos">FAVORITOS</a><a href="#por-dentro">POR DENTRO</a><a href="#combos">COMBOS</a></nav>
  ${order('PEDIR AGORA','header','button-small')}
  <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
</header>
<nav id="mobile-nav" class="mobile-nav" aria-label="Navegação mobile" hidden><a href="#favoritos"><span>01</span> FAVORITOS ${icon('arrow','nav-arrow')}</a><a href="#por-dentro"><span>02</span> POR DENTRO ${icon('arrow','nav-arrow')}</a><a href="#combos"><span>03</span> COMBOS ${icon('arrow','nav-arrow')}</a><div class="mobile-nav-footer">${order('PEDIR AGORA','header','mobile-menu-order')}</div></nav>
<main>
<section class="hero" id="inicio" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow"><span class="mini-star" aria-hidden="true">${icon('sparkle')}</span> JOINVILLE • SC <span class="eyebrow-separator">/</span> FEITO PRA SORRIR</p>
    <h1 id="hero-title">${heading('TÁ RACHANDO')}${heading('O BICO')}<span class="hero-last-line">${heading('DE FOME?')}</span></h1>
    <p class="hero-sub">Então pede um Smile.</p>
    <div class="hero-actions">${order('PEDIR AGORA','hero')}<a class="text-link" href="#favoritos">VER OS FAVORITOS ${icon('down')}</a></div>
    <p class="hours">SEGUNDA A SEXTA <span aria-hidden="true">•</span> DELIVERY • 19H–23H</p>
  </div>
  <div class="hero-art" data-depth="hero">
    <div class="hero-halo" aria-hidden="true"></div>
    <div class="hero-photo"><img src="assets/hero-gargalhada.webp" alt="Gargalhada: burger artesanal com cheddar, bacon e abacaxi tostado" width="1000" height="878" fetchpriority="high" decoding="async"></div>
    <span class="hero-sticker"><small>ARTESANAL</small><b>ATÉ O<br>ÚLTIMO<br>SORRISO.</b><small>${icon('star')} JOINVILLE ${icon('star')}</small></span>
    <span class="hero-note">fome de respeito.<br>sorriso garantido.</span>
    <span class="hero-spark" aria-hidden="true">${icon('burst')}</span>
  </div>
  <div class="hero-bottom"><span>BURGER BOM. HUMOR MELHOR AINDA.</span><a href="#favoritos">DESCE QUE TEM MAIS ${icon('down')}</a></div>
</section>
<div class="marquee-bridge" aria-hidden="true"><div class="marquee-back">KEEP SMILING :) &nbsp; KEEP SMILING :) &nbsp; KEEP SMILING :)</div><div class="marquee"><div>${marqueeText.repeat(3)}</div><div>${marqueeText.repeat(3)}</div></div></div>
<section class="favorites section" id="favoritos" aria-labelledby="favorites-title">
  <div class="section-heading reveal"><div><p class="eyebrow">O TIME QUE ARRANCA SORRISOS</p><h2 id="favorites-title">${heading('OS MAIS')}<span>${heading('PEDIDOS.')}</span></h2></div><p>Tem um Smile com a sua cara.<br>E com a sua fome também.</p><span class="section-mark" aria-hidden="true">01</span></div>
  <div class="favorites-grid" tabindex="0" aria-label="Favoritos: deslize ou use as setas para explorar">
  ${products.slice(0,3).map((p,i)=>`<article class="product-poster poster-${i} reveal" data-depth="poster" data-product="${p.id}">
    <div class="poster-top"><span>0${i+1} / FAVORITOS</span><span aria-hidden="true">${icon('sparkle')}</span></div>
    <h3>${p.name}</h3>
    <div class="poster-image" data-cursor="NHAC">${image(p.image,`${p.name}, fotografia real do burger artesanal`,{sizes:'(max-width: 700px) 78vw, 35vw'})}<span class="poster-sticker">${i===0?'COM ABACAXI<br>TOSTADO':i===1?'FRESCOR<br>EM CAMADAS':'BACON<br>CROCANTE'}</span></div>
    <div class="poster-bottom"><p class="product-tag">${p.tag}</p><p class="ingredients">${p.ingredients}</p>${order('QUERO ESSE','product','poster-cta',p.id)}</div>
  </article>`).join('\n')}
  </div><p class="swipe-note">DESLIZE PRA DAR MATCH COM A SUA FOME ${icon('arrow','swipe-arrow')}</p>
</section>
<section class="inside section" id="por-dentro" aria-labelledby="inside-title">
  <div class="inside-copy reveal"><p class="eyebrow">CADA CAMADA TEM SEU CHARME</p><h2 id="inside-title">${heading('UM SORRISO')}${heading('EM CADA')}<span>${heading('CAMADA.')}</span></h2><p class="inside-product">RACHANDO O BICO</p><p>Um encontro de frescor, queijo derretido e aquele toque de geleia de pimenta. Por dentro, ele é ainda mais irresistível.</p><p class="hand-note">pode abrir.<br>o segredo é ser bom.</p><div class="inside-order">${order('QUERO PROVAR','product','','rachando')}</div></div>
  <div class="burger-experience"><div class="experience-heading"><span>POR DENTRO DO SMILE</span><span class="experience-counter" aria-hidden="true">00 / 100</span></div>
    <div class="burger-scene" id="burger-scene">
      <div class="stage-orbit" aria-hidden="true"></div>
      <button class="burger-stage" id="burger-toggle" aria-expanded="false" aria-label="Abrir as camadas do Rachando o Bico" aria-describedby="burger-instructions burger-ingredients">
      ${burgerLayers.map((l,i)=>`<span class="ingredient-layer" data-layer="${l.id}" style="--closed:${l.closed}px;--spread:${l.open-l.closed}px;--offset:${l.x}px;--turn:${l.rotation}deg;--layer-scale:${l.scale};--layer-order:${12-i};--layer-depth:${(1.35 - i * 0.1).toFixed(2)}"><img src="assets/burger-layers/${l.id}.webp" alt="" width="800" height="${layerManifest[l.id].height}" loading="lazy" decoding="async"></span>`).join('\n')}
      </button>
      <div class="layer-labels" id="ingredient-labels" aria-hidden="true">${burgerLayers.map((l,i)=>`<span class="layer-label label-${i%2?'right':'left'}" style="--closed:${l.closed}px;--spread:${l.open-l.closed}px;--label-delay:${i*14}ms"><span>${l.name}</span><svg aria-hidden="true" viewBox="0 0 58 18"><path d="M1 14 Q25 1 54 6 M48 2 L55 6 L48 11"/></svg></span>`).join('')}</div>
      <span class="drag-affordance" aria-hidden="true">${icon('drag')}<b>ARRASTE. DESCUBRA. SORRIA.</b></span>
    </div>
    <div class="burger-controls"><p id="burger-instructions"><span class="touch-instructions">Arraste para cima para abrir. Para baixo, para montar.</span><span class="mouse-instructions">Passe o mouse para explorar. Clique para manter aberto.</span></p><details class="accessible-controls"><summary>Controlar as camadas pelo teclado</summary><label for="layer-range">Separação dos ingredientes</label><div class="range-row"><span>JUNTO</span><input id="layer-range" type="range" min="0" max="100" value="0" aria-valuetext="Burger montado"><span>ABERTO</span></div></details><p class="sr-only" id="burger-ingredients">Ingredientes: pão brioche, alface americana, cebola roxa, tomate, geleia de pimenta, mussarela, burger artesanal 130g, maionese de alho suave e pão inferior.</p></div>
  </div>
</section>
<section class="more section" aria-labelledby="more-title"><div class="section-heading reveal"><div><p class="eyebrow">A FOME É SUA. A ESCOLHA TAMBÉM.</p><h2 id="more-title">${heading('MAIS MOTIVOS')}PRA <span>SORRIR.</span></h2></div><a class="text-link" href="${ORDER_URL}" target="_blank" rel="noopener noreferrer" data-order="product">CARDÁPIO COMPLETO ${icon('arrow')}</a><span class="section-mark" aria-hidden="true">02</span></div>
  <div class="more-grid">${products.slice(3).map((p,i)=>`<article class="mini-product editorial-${i} reveal" data-product="${p.id}"><div class="mini-photo reveal-image" data-cursor="NHAC">${image(p.image,p.name,{sizes:'(max-width: 700px) 80vw, 35vw'})}<span class="catalog-number">0${i+4}</span></div><div class="mini-copy"><h3>${p.name}</h3><p>${p.ingredients}</p><a class="text-link" href="${ORDER_URL}" target="_blank" rel="noopener noreferrer" data-order="product" data-product="${p.id}">QUERO ESSE ${icon('arrow')}</a></div></article>`).join('\n')}</div>
</section>
<section class="brand-moment" aria-labelledby="brand-headline">${image('smile-bacon','Smile Bacon com bacon crocante, queijo e maionese de alho',{sizes:'100vw',className:'brand-photo'})}<div class="brand-overlay"></div><div class="brand-content reveal"><p class="eyebrow">SEM ECONOMIZAR NO SORRISO.</p><h2 id="brand-headline">${heading('UM SORRISO')}${heading('A CADA')}<em>${heading('MORDIDA.')}</em></h2><span class="brand-stamp">KEEP<br>SMILING :)</span></div></section>
<section class="combos section" id="combos" aria-labelledby="combos-title"><div class="section-heading reveal"><div><p class="eyebrow">BURGER + BATATA + BEBIDA</p><h2 id="combos-title">${heading('COMBO DE')}<span>${heading('FELICIDADE.')}</span></h2></div><span class="combo-doodle" aria-hidden="true">JUNTOS<br>É MAIS GOSTOSO! ${icon('sparkle')}</span><span class="section-mark" aria-hidden="true">03</span></div>
${combos.map((c,i)=>`<article class="combo combo-${i} reveal" data-depth="combo" data-product="${c.name}"><div class="combo-image" data-cursor="NHAC">${image(c.image,`Combo ${c.name}: hambúrguer${i?'es':''}, batata${i?'s':''} e bebida${i?'s':''}`,{sizes:'(max-width: 700px) 90vw, 53vw'})}<span class="combo-number">0${i+1}</span>${i?'<span class="sharing-sticker" aria-hidden="true">BOM MESMO<br>É DIVIDIR.</span>':''}</div><div class="combo-copy"><p class="eyebrow">${c.label}</p><h3>${c.headline}</h3><p class="combo-name">${c.name}</p><p>${c.description}</p>${order('BORA DE COMBO','combo','',c.name)}</div></article>`).join('\n')}
<div class="fries-note"><span aria-hidden="true">${icon('sparkle')}</span><p><b>NÃO ESQUECE A BATATA!</b> Uma porção de 150g pra completar o sorriso.</p><a class="text-link" href="${ORDER_URL}" target="_blank" rel="noopener noreferrer" data-order="combo">EU QUERO ${icon('arrow')}</a></div>
</section>
<section class="how section"><p class="eyebrow reveal">DA VONTADE À PRIMEIRA MORDIDA</p><h2 class="reveal">É FÁCIL ASSIM.</h2><div class="steps">${[['ESCOLHE','Encontra o Smile da vez.'],['PEDE','Fecha seu pedido no Goomer.'],['CHEGOU','Recebe e abre a felicidade.'],['SORRI','O resto é com a primeira mordida.']].map((s,i)=>`<div class="step reveal"><span class="step-number">0${i+1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div>${order('COMEÇAR PELO SORRISO','hero')}</section>
<section class="social section"><div class="social-copy reveal"><p class="eyebrow">SEU FEED TAMBÉM MERECE</p><h2>${heading('SEGUE')}O <span>SMILE.</span></h2><p>Um pouquinho de fome<br>entre um scroll e outro.</p><a class="button" href="${siteSettings.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" data-instagram><span class="button-text">SEGUIR @OSMILEBURGER</span>${arrow}</a></div><div class="social-photos reveal"><figure data-cursor="VER">${image('gargalhada','Gargalhada com abacaxi tostado',{sizes:'(max-width:700px) 50vw, 26vw'})}<figcaption>um caso sério com burger.</figcaption></figure><figure data-cursor="VER">${image('smile-salad','Camadas de frescor do Smile Salad',{sizes:'(max-width:700px) 50vw, 26vw'})}<figcaption>@osmileburger</figcaption></figure><span class="social-star" aria-hidden="true">${icon('sparkle')}</span></div></section>
<section class="final-cta section"><p class="eyebrow reveal">A GENTE SABE QUE DEU VONTADE.</p><h2 class="reveal">${heading('BORA')}<span>${heading('RACHAR O BICO?')}</span></h2>${order('PEDIR AGORA','footer','giant-button')}<p>JOINVILLE • SEGUNDA A SEXTA • 19H–23H</p></section>
</main>
<footer><div class="footer-top">${logo(true)}<div><b>FEITO EM JOINVILLE.</b><span>Joinville – SC</span></div><div><b>HORA DO SMILE</b><span>Segunda a sexta<br>19h – 23h</span></div><div><a href="${siteSettings.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" data-instagram>INSTAGRAM ${icon('arrow')}</a><a href="${ORDER_URL}" data-order="footer" target="_blank" rel="noopener noreferrer">CARDÁPIO / PEDIDOS ${icon('arrow')}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} O Smile Burger</span><b>KEEP SMILING :)</b><a href="#inicio">LÁ PRA CIMA ${icon('up')}</a></div></footer>
<div class="cursor-tag" aria-hidden="true"></div>
${order('PEDIR AGORA','sticky','sticky-order')}
</body>
</html>`;
}
