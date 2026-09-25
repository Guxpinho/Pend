/* ============================================================
   creatures.js — Catálogo de espécies + geração de SVG placeholder
   Carregado ANTES de game.js
   ============================================================ */

var SPECIES = [
  {id:'folhito',    name:'Folhito',    description:'Um broto ambulante.',      type:'nature',   rarity:'common',    baseHp:40, baseAtk:12, baseDef:14, baseSpd:10, habitats:['forest']},
  {id:'gotinha',    name:'Gotinha',    description:'Uma gota viva.',           type:'aqua',     rarity:'common',    baseHp:38, baseAtk:11, baseDef:12, baseSpd:14, habitats:['water']},
  {id:'rateluz',    name:'Rateluz',    description:'Rato urbano.',             type:'urban',    rarity:'common',    baseHp:42, baseAtk:13, baseDef:11, baseSpd:16, habitats:['city']},
  {id:'areinho',    name:'Areinho',    description:'Grão animado.',            type:'sand',     rarity:'common',    baseHp:44, baseAtk:12, baseDef:16, baseSpd:8,  habitats:['desert']},
  {id:'gelito',     name:'Gelito',     description:'Cristal de gelo.',         type:'ice',      rarity:'common',    baseHp:40, baseAtk:13, baseDef:15, baseSpd:11, habitats:['ice']},
  {id:'sombrinho',  name:'Sombrinho',  description:'Aparece à noite.',         type:'shadow',   rarity:'common',    baseHp:36, baseAtk:15, baseDef:10, baseSpd:15, habitats:['night']},
  {id:'folharo',    name:'Folharo',    description:'Folhas cortantes.',        type:'nature',   rarity:'uncommon',  baseHp:65, baseAtk:22, baseDef:20, baseSpd:18, habitats:['forest']},
  {id:'aquor',      name:'Aquor',      description:'Controla correntes.',      type:'aqua',     rarity:'uncommon',  baseHp:62, baseAtk:24, baseDef:18, baseSpd:20, habitats:['water']},
  {id:'ratron',     name:'Ratron',     description:'Rato elétrico.',           type:'electric', rarity:'uncommon',  baseHp:60, baseAtk:26, baseDef:16, baseSpd:24, habitats:['city']},
  {id:'dunaro',     name:'Dunaro',     description:'Tempestade viva.',         type:'sand',     rarity:'uncommon',  baseHp:70, baseAtk:22, baseDef:24, baseSpd:14, habitats:['desert']},
  {id:'glacior',    name:'Glacior',    description:'Gelo eterno.',             type:'ice',      rarity:'uncommon',  baseHp:68, baseAtk:21, baseDef:26, baseSpd:12, habitats:['ice']},
  {id:'noturno',    name:'Noturno',    description:'Sombra observadora.',      type:'shadow',   rarity:'uncommon',  baseHp:58, baseAtk:28, baseDef:14, baseSpd:22, habitats:['night']},
  {id:'folhazar',   name:'Folhazar',   description:'Guardião da mata.',        type:'nature',   rarity:'rare',      baseHp:100,baseAtk:38, baseDef:34, baseSpd:26, habitats:['forest']},
  {id:'braseiro',   name:'Braseiro',   description:'Núcleo de fogo.',          type:'fire',     rarity:'rare',      baseHp:88, baseAtk:42, baseDef:26, baseSpd:30, habitats:['desert','night']},
  {id:'ventari',    name:'Ventari',    description:'Espírito do vento.',       type:'wind',     rarity:'rare',      baseHp:82, baseAtk:36, baseDef:24, baseSpd:40, habitats:['forest','ice']},
  {id:'pedruno',    name:'Pedruno',    description:'Rocha viva.',              type:'stone',    rarity:'rare',      baseHp:120,baseAtk:34, baseDef:48, baseSpd:8,  habitats:['desert','forest']},
  {id:'tempestrix', name:'Tempestrix', description:'Senhor das tempestades.',  type:'electric', rarity:'epic',      baseHp:130,baseAtk:58, baseDef:42, baseSpd:52, habitats:['city','night']},
  {id:'abyssal',    name:'Abyssal',    description:'Das profundezas.',         type:'aqua',     rarity:'epic',      baseHp:140,baseAtk:54, baseDef:50, baseSpd:38, habitats:['water','ice']},
  {id:'aurorion',   name:'Aurorion',   description:'Lenda do gelo.',           type:'ice',      rarity:'legendary', baseHp:200,baseAtk:88, baseDef:80, baseSpd:70, habitats:['ice','night']},
  {id:'solaris',    name:'Solaris',    description:'Lenda do deserto.',        type:'fire',     rarity:'legendary', baseHp:210,baseAtk:92, baseDef:76, baseSpd:74, habitats:['desert','city']}
];

var SPECIES_BY_ID = {};
SPECIES.forEach(function(s){ SPECIES_BY_ID[s.id] = s; });

var TYPE_COLORS = {
  nature:'#22c55e', aqua:'#3b82f6', urban:'#94a3b8', sand:'#eab308',
  ice:'#67e8f9', shadow:'#7c3aed', fire:'#ef4444', electric:'#facc15',
  wind:'#a7f3d0', stone:'#78716c'
};

/* Gera um SVG placeholder em data-URI, colorido pelo tipo da criatura. */
function creatureSVG(id){
  var sp = SPECIES_BY_ID[id];
  if(!sp) return '';
  var c1 = TYPE_COLORS[sp.type] || '#64748b';
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    + '<defs><radialGradient id="g" cx="50%" cy="40%">'
    + '<stop offset="0%" stop-color="' + c1 + '"/>'
    + '<stop offset="100%" stop-color="#0b1020"/></radialGradient></defs>'
    + '<circle cx="32" cy="32" r="28" fill="url(#g)" stroke="' + c1 + '" stroke-width="2"/>'
    + '<circle cx="22" cy="28" r="4" fill="#fff"/>'
    + '<circle cx="42" cy="28" r="4" fill="#fff"/>'
    + '<circle cx="22" cy="28" r="2" fill="#000"/>'
    + '<circle cx="42" cy="28" r="2" fill="#000"/>'
    + '<path d="M22 42 Q32 50 42 42" stroke="#fff" stroke-width="2" fill="none"/>'
    + '<text x="32" y="60" font-size="6" text-anchor="middle" fill="' + c1 + '" font-family="monospace">'
    + sp.name.toUpperCase() + '</text>'
    + '</svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}