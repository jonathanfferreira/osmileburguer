export const ORDER_URL = 'https://o-smile-burger-1.goomer.app/menu';
export const siteSettings = {name:'O Smile Burger',city:'Joinville – SC',hours:'Segunda a sexta · 19h–23h',socialLinks:{instagram:'https://www.instagram.com/osmileburger/'}};
export const products = [
{id:'gargalhada',name:'Gargalhada',image:'gargalhada',tag:'DOCE, SALGADO & UM SORRISO',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo cheddar, bacon, fina fatia de abacaxi tostado com mel e maionese de alho suave.'},
{id:'salad',name:'Smile Salad',image:'smile-salad',tag:'FRESQUINHO. CAPRICHADO. SMILE.',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo mussarela, alface americana, tomate, cebola, picles e maionese de alho suave.'},
{id:'bacon',name:'Smile Bacon',image:'smile-bacon',tag:'CROCÂNCIA QUE FAZ BARULHO',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo mussarela, bacon crocante e maionese de alho suave.'},
{id:'cheese',name:'Cheese Burger',image:'cheese-burger',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo cheddar e maionese de alho suave.'},
{id:'calabresa',name:'Smile Calabresa',image:'smile-calabresa',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo mussarela, calabresa, alface americana, tomate, cebola americana e maionese de alho suave.'},
{id:'melt',name:'Chorriso Melt',image:'chorriso-melt',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo cheddar, cebola caramelizada e maionese de alho suave.'},
{id:'rachando',name:'Rachando o Bico',image:'rachando-o-bico',ingredients:'Pão brioche, hambúrguer artesanal de 130g, queijo mussarela, geleia de pimenta, alface americana, tomate, cebola roxa e maionese de alho suave.'}
];
export const combos = [{name:'Rindo sozinho',headline:'SOZINHO?<br>A GENTE RESOLVE.',description:'Seu lanche favorito, uma batata e uma bebida. Monte do seu jeito!',image:'rindo-sozinho',label:'SEU MOMENTO, SEU SMILE.'},{name:'Sorriso a dois',headline:'A DOIS<br>FICA MELHOR.',description:'Dois hambúrgueres, duas batatas e duas bebidas para dividir bons momentos!',image:'sorriso-a-dois',label:'COMPANHIA BOA. COMBO TAMBÉM.'}];

export const SITE_URL = 'https://osmileburguer.vercel.app/';

export const burgerLayers = [
  {id:'bun-top',name:'PÃO BRIOCHE',closed:-101,open:-234,x:-5,rotation:-4,scale:1.01},
  {id:'lettuce',name:'ALFACE AMERICANA',closed:-53,open:-154,x:8,rotation:3,scale:1.04},
  {id:'onion',name:'CEBOLA ROXA',closed:-36,open:-103,x:-8,rotation:-5,scale:.92},
  {id:'tomato',name:'TOMATE',closed:-20,open:-50,x:5,rotation:3,scale:.96},
  {id:'pepper-jam',name:'GELEIA DE PIMENTA',closed:-3,open:1,x:-4,rotation:-2,scale:.91},
  {id:'mozzarella',name:'MUSSARELA',closed:14,open:51,x:7,rotation:4,scale:1.02},
  {id:'patty',name:'BURGER 130G',closed:38,open:110,x:-5,rotation:-3,scale:1},
  {id:'garlic-mayo',name:'MAIONESE DE ALHO',closed:57,open:164,x:5,rotation:2,scale:.91},
  {id:'bun-bottom',name:'PÃO INFERIOR',closed:83,open:221,x:-2,rotation:-2,scale:.99}
];
export const photoPositions = {'gargalhada':'50% 46%','smile-salad':'50% 52%','smile-bacon':'50% 52%','cheese-burger':'50% 48%','smile-calabresa':'50% 51%','chorriso-melt':'50% 56%','rachando-o-bico':'50% 54%','rindo-sozinho':'50% 55%','sorriso-a-dois':'50% 56%'};
