/* ============================================================
   game.js — Lógica do jogo (mapa, spawn, encontro, captura, UI)
   Requer creatures.js carregado antes.
   ============================================================ */

/* ---------- CONFIG ---------- */
var CONFIG = {
  spawnRadius: 150,
  maxSpawns: 40,
  minVisible: 8,
  spawnIntervalMs: 8000,
  baseRates: { common:0.75, uncommon:0.55, rare:0.30, epic:0.15, legendary:0.05 },
  capsuleMul: { capsule_basic:1.0, capsule_good:1.35, capsule_ultra:1.8, capsule_master:100 },
  rarityWeights: { common:60, uncommon:25, rare:10, epic:4, legendary:1 },
  rarityTTL: { common:300000, uncommon:480000, rare:720000, epic:900000, legendary:1200000 },
  rarityLabel: { common:'COMUM', uncommon:'INCOMUM', rare:'RARO', epic:'ÉPICO', legendary:'LENDÁRIO' },
  rarityColor: { common:'#94a3b8', uncommon:'#22c55e', rare:'#3b82f6', epic:'#a855f7', legendary:'#f59e0b' }
};

var FALLBACK = { lat: -23.5613, lng: -46.6565 };

/* ---------- ESTADO ---------- */
var state = {
  player: { lat:FALLBACK.lat, lng:FALLBACK.lng, level:1, xp:0, coins:100, capturedCount:0, discovered:{} },
  spawns: [],
  collection: [],
  inventory: { capsule_basic:20, capsule_good:5, capsule_ultra:1, capsule_master:0 },
  activeSpawn: null,
  map: null,
  playerMarker: null,
  spawnMarkers: {},
  selectedCapsule: 'capsule_basic'
};

var SAVE_KEY = 'mw_save_v1';
var currentDrawer = null;

/* ---------- PERSISTÊNCIA ---------- */
function save(){
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      player:{
        level: state.player.level, xp: state.player.xp, coins: state.player.coins,
        capturedCount: state.player.capturedCount, discovered: state.player.discovered
      },
      collection: state.collection,
      inventory: state.inventory
    }));
  }catch(e){ console.warn('save failed', e); }
}

function load(){
  try{
    var raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return;
    var d = JSON.parse(raw);
    state.player.level = d.player.level || 1;
    state.player.xp = d.player.xp || 0;
    state.player.coins = d.player.coins || 100;
    state.player.capturedCount = d.player.capturedCount || 0;
    state.player.discovered = d.player.discovered || {};
    state.collection = d.collection || [];
    state.inventory = d.inventory || state.inventory;
  }catch(e){ console.warn('load failed', e); }
}

/* ---------- UTILIDADES ---------- */
function toRad(d){ return d * Math.PI / 180; }

function distanceMeters(a, b){
  var R = 6371000;
  var dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  var l1 = toRad(a.lat), l2 = toRad(b.lat);
  var h = Math.sin(dLat/2) * Math.sin(dLat/2)
        + Math.cos(l1) * Math.cos(l2) * Math.sin(dLng/2) * Math.sin(dLng/2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function offsetLatLng(p, meters, bearingDeg){
  var R = 6371000, br = toRad(bearingDeg);
  var lat1 = toRad(p.lat), lng1 = toRad(p.lng);
  var lat2 = Math.asin(Math.sin(lat1) * Math.cos(meters/R)
                     + Math.cos(lat1) * Math.sin(meters/R) * Math.cos(br));
  var lng2 = lng1 + Math.atan2(
    Math.sin(br) * Math.sin(meters/R) * Math.cos(lat1),
    Math.cos(meters/R) - Math.sin(lat1) * Math.sin(lat2)
  );
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

function weightedPick(weights){
  var total = 0;
  weights.forEach(function(w){ total += w[1]; });
  var r = Math.random() * total;
  for(var i = 0; i < weights.length; i++){
    r -= weights[i][1];
    if(r <= 0) return weights[i][0];
  }
  return weights[weights.length - 1][0];
}

function isNight(){
  var h = new Date().getHours();
  return h < 6 || h >= 19;
}

function inferBiomes(p){
  var s = {};
  var absLat = Math.abs(p.lat);
  if(absLat > 55) s.ice = true;
  else if(absLat < 15) s.desert = true;
  else s.forest = true;
  s.city = true;
  s.water = true;
  if(isNight()) s.night = true;
  return Object.keys(s);
}

function showToast(msg, ms){
  ms = ms || 2200;
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ t.classList.remove('show'); }, ms);
}

/* ---------- MAPA ---------- */
function initMap(){
  state.map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap'
        }
      },
      layers: [
        {
          id: 'osm', type: 'raster', source: 'osm',
          paint: {
            'raster-saturation': -0.6,
            'raster-brightness-max': 0.55,
            'raster-contrast': 0.25,
            'raster-hue-rotate': 200
          }
        }
      ]
    },
    center: [FALLBACK.lng, FALLBACK.lat],
    zoom: 15
  });

  state.map.on('load', function(){
    state.map.resize();
    addPlayerMarker();
    ensureSpawns();
    setInterval(ensureSpawns, CONFIG.spawnIntervalMs);
    setInterval(cleanupExpired, 15000);
    showToast('Bem-vindo ao Monster World! 🌍');
  });
}

function addPlayerMarker(){
  var el = document.createElement('div');
  el.style.cssText =
    'width:20px;height:20px;border-radius:50%;' +
    'background:radial-gradient(circle,#22d3ee 40%,#0ea5e9 100%);' +
    'box-shadow:0 0 16px #22d3ee,0 0 32px rgba(34,211,238,.5);' +
    'border:2px solid #fff;';
  state.playerMarker = new maplibregl.Marker({ element: el })
    .setLngLat([state.player.lng, state.player.lat])
    .addTo(state.map);
}

/* ---------- SPAWN ---------- */
function pickSpecies(biomes){
  var night = isNight();
  var pool = SPECIES.filter(function(s){
    if(night && s.habitats.indexOf('night') >= 0) return true;
    for(var i = 0; i < s.habitats.length; i++){
      if(biomes.indexOf(s.habitats[i]) >= 0) return true;
    }
    return false;
  });
  var candidates = pool.length ? pool : SPECIES;
  var rarity = weightedPick(
    Object.keys(CONFIG.rarityWeights).map(function(k){
      return [k, CONFIG.rarityWeights[k]];
    })
  );
  var byRarity = candidates.filter(function(s){ return s.rarity === rarity; });
  var finalPool = byRarity.length ? byRarity : candidates;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

function generateSpawn(){
  var biomes = inferBiomes(state.player);
  var species = pickSpecies(biomes);
  var bearing = Math.random() * 360;
  var dist = 30 + Math.random() * (CONFIG.spawnRadius - 30);
  var pos = offsetLatLng(state.player, dist, bearing);
  var now = Date.now();
  return {
    id: 'spawn_' + now + '_' + Math.random().toString(36).slice(2, 6),
    speciesId: species.id,
    lat: pos.lat, lng: pos.lng,
    rarity: species.rarity,
    bornAt: now,
    expiresAt: now + CONFIG.rarityTTL[species.rarity],
    level: 1 + Math.floor(Math.random() * 10),
    status: 'active'
  };
}

function renderSpawnMarker(spawn){
  var sp = SPECIES_BY_ID[spawn.speciesId];
  var el = document.createElement('button');
  el.className = 'spawn-marker';
  el.style.filter = 'drop-shadow(0 0 8px ' + CONFIG.rarityColor[spawn.rarity] + ')';
  el.innerHTML = '<img src="' + creatureSVG(sp.id) + '" alt="' + sp.name + '"/>'
               + '<span>' + sp.name + '</span>';
  el.addEventListener('click', function(){ openEncounter(spawn.id); });
  var marker = new maplibregl.Marker({ element: el })
    .setLngLat([spawn.lng, spawn.lat])
    .addTo(state.map);
  state.spawnMarkers[spawn.id] = marker;
}

function removeSpawnMarker(id){
  var m = state.spawnMarkers[id];
  if(m){ m.remove(); delete state.spawnMarkers[id]; }
}

function ensureSpawns(){
  var now = Date.now();
  state.spawns = state.spawns.filter(function(s){
    if(s.status !== 'active' || s.expiresAt <= now){
      removeSpawnMarker(s.id);
      return false;
    }
    return true;
  });
  var room = Math.max(0, CONFIG.maxSpawns - state.spawns.length);
  var need = Math.min(CONFIG.minVisible - state.spawns.length, room);
  for(var i = 0; i < need; i++){
    var sp = generateSpawn();
    state.spawns.push(sp);
    renderSpawnMarker(sp);
  }
}

function cleanupExpired(){
  var now = Date.now();
  state.spawns = state.spawns.filter(function(s){
    if(s.status === 'active' && s.expiresAt > now) return true;
    removeSpawnMarker(s.id);
    return false;
  });
}

/* ---------- ENCONTRO ---------- */
function openEncounter(spawnId){
  var spawn = null;
  for(var i = 0; i < state.spawns.length; i++){
    if(state.spawns[i].id === spawnId){ spawn = state.spawns[i]; break; }
  }
  if(!spawn || spawn.status !== 'active') return;

  state.activeSpawn = spawn;
  var sp = SPECIES_BY_ID[spawn.speciesId];

  document.getElementById('encImg').src = creatureSVG(sp.id);
  document.getElementById('encName').textContent = sp.name;
  document.getElementById('encLevel').textContent = spawn.level;
  document.getElementById('encType').textContent = sp.type;
  document.getElementById('encDist').textContent =
    Math.round(distanceMeters(state.player, spawn)) + 'm';
  document.getElementById('encRarity').textContent = CONFIG.rarityLabel[spawn.rarity];
  document.getElementById('encRarity').style.background = CONFIG.rarityColor[spawn.rarity];
  document.getElementById('encRarity').style.color = '#0b1020';
  document.getElementById('captureResult').textContent = '';

  var caps = (state.inventory.capsule_basic || 0)
           + (state.inventory.capsule_good  || 0)
           + (state.inventory.capsule_ultra || 0)
           + (state.inventory.capsule_master|| 0);
  document.getElementById('encCapsules').textContent = caps;
  document.getElementById('encChance').textContent =
    Math.round(computeCaptureChance(spawn.rarity, spawn.level) * 100) + '%';

  document.getElementById('encounter').classList.add('show');
  updateCaptureButton();
}

function closeEncounter(){
  document.getElementById('encounter').classList.remove('show');
  state.activeSpawn = null;
}

/* ---------- CAPTURA ---------- */
function computeCaptureChance(rarity, level){
  var base = CONFIG.baseRates[rarity] || 0.1;
  var mul = CONFIG.capsuleMul[state.selectedCapsule] || 1;
  var penalty = Math.max(0.4, 1 - (level - 1) * 0.03);
  return Math.min(1, base * mul * penalty);
}

function updateCaptureButton(){
  var btn = document.getElementById('btnCapture');
  var qty = state.inventory[state.selectedCapsule] || 0;
  btn.disabled = qty <= 0;
  btn.textContent = qty > 0
    ? '🎯 CAPTURAR (' + qty + ')'
    : '❌ SEM CÁPSULAS';
}

function doCapture(){
  var spawn = state.activeSpawn;
  if(!spawn) return;

  var inv = state.inventory;
  if((inv[state.selectedCapsule] || 0) <= 0){
    showToast('Você não tem essa cápsula!');
    return;
  }
  inv[state.selectedCapsule]--;

  var chance = computeCaptureChance(spawn.rarity, spawn.level);
  var success = Math.random() < chance;

  var result = document.getElementById('captureResult');
  var card = document.querySelector('#encounter .card');

  if(success){
    result.textContent = '✨ CRIATURA CAPTURADA!';
    result.style.color = '#a3e635';

    state.player.discovered[spawn.speciesId] = true;

    var sp = SPECIES_BY_ID[spawn.speciesId];
    state.collection.unshift({
      id: 'inst_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      speciesId: spawn.speciesId,
      name: sp.name,
      level: spawn.level,
      hp: sp.baseHp,
      maxHp: sp.baseHp,
      type: sp.type,
      rarity: sp.rarity,
      favorite: false,
      capturedAt: Date.now()
    });

    var xpGain = xpFromCapture(spawn.rarity, spawn.level);
    var coinGain = coinFromCapture(spawn.rarity);
    gainXp(xpGain);
    state.player.coins += coinGain;
    state.player.capturedCount++;

    showToast('+' + xpGain + ' XP · +' + coinGain + ' 🪙 · ' + sp.name + ' capturado!');

    removeSpawnMarker(spawn.id);
    state.spawns = state.spawns.filter(function(s){ return s.id !== spawn.id; });

    updateHUD();
    save();
    setTimeout(closeEncounter, 900);
  } else {
    result.textContent = '💨 A criatura escapou!';
    result.style.color = '#f87171';
    card.classList.add('shake');
    setTimeout(function(){ card.classList.remove('shake'); }, 500);

    if(Math.random() < 0.3){
      removeSpawnMarker(spawn.id);
      state.spawns = state.spawns.filter(function(s){ return s.id !== spawn.id; });
      showToast('A criatura fugiu para longe!');
      setTimeout(closeEncounter, 700);
    }
  }

  updateCaptureButton();
}

/* ---------- XP / NÍVEL ---------- */
function xpForLevel(level){ return Math.floor(50 * Math.pow(level, 1.5)); }

function xpFromCapture(rarity, level){
  var base = { common:20, uncommon:40, rare:80, epic:160, legendary:400 }[rarity] || 15;
  return Math.round(base * (1 + level * 0.05));
}

function coinFromCapture(rarity){
  var base = { common:5, uncommon:12, rare:30, epic:80, legendary:250 }[rarity] || 3;
  return base + Math.floor(Math.random() * base * 0.4);
}

function gainXp(amount){
  state.player.xp += amount;
  var leveled = false;
  while(state.player.xp >= xpForLevel(state.player.level)){
    state.player.xp -= xpForLevel(state.player.level);
    state.player.level++;
    leveled = true;
  }
  if(leveled){
    state.player.coins += state.player.level * 20;
    showToast('⬆️ Subiu para o nível ' + state.player.level + '!');
  }
  updateHUD();
}

/* ---------- HUD ---------- */
function updateHUD(){
  document.getElementById('hudLevel').textContent = state.player.level;
  document.getElementById('hudXp').textContent = state.player.xp;
  document.getElementById('hudCoins').textContent = state.player.coins;
  document.getElementById('hudCaptured').textContent = state.player.capturedCount;
}

/* ---------- DRAWER (coleção / dex / inventário / perfil) ---------- */
function openDrawer(kind){
  currentDrawer = kind;
  var title = document.getElementById('drawerTitle');
  var body = document.getElementById('drawerBody');

  if(kind === 'collection'){
    title.textContent = 'Coleção (' + state.collection.length + ')';
    renderCollection(body);
  } else if(kind === 'dex'){
    var count = Object.keys(state.player.discovered).length;
    title.textContent = 'Enciclopédia (' + count + '/' + SPECIES.length + ')';
    renderDex(body);
  } else if(kind === 'inventory'){
    title.textContent = 'Inventário';
    renderInventory(body);
  } else if(kind === 'profile'){
    title.textContent = 'Perfil';
    renderProfile(body);
  }
  document.getElementById('drawer').classList.add('open');
}

function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  currentDrawer = null;
}

function renderCollection(body){
  if(state.collection.length === 0){
    body.innerHTML = '<div class="empty">Você ainda não capturou nenhuma criatura.<br/>'
                   + 'Explore o mapa para encontrar sua primeira! 🐾</div>';
    return;
  }
  var html = '<div class="grid">';
  for(var i = 0; i < state.collection.length; i++){
    var c = state.collection[i];
    html += '<div class="ccard">'
      + '<button class="fav ' + (c.favorite ? 'on' : '') + '" onclick="toggleFav(\'' + c.id + '\')">★</button>'
      + '<img src="' + creatureSVG(c.speciesId) + '" alt="' + c.name + '"/>'
      + '<div class="name">' + c.name + '</div>'
      + '<div class="sub">Nv. ' + c.level + ' · ' + CONFIG.rarityLabel[c.rarity] + '</div>'
      + '<div class="sub">' + c.type + '</div>'
      + '</div>';
  }
  html += '</div>';
  body.innerHTML = html;
}

function toggleFav(id){
  for(var i = 0; i < state.collection.length; i++){
    if(state.collection[i].id === id){
      state.collection[i].favorite = !state.collection[i].favorite;
      break;
    }
  }
  save();
  if(currentDrawer === 'collection') openDrawer('collection');
}

function renderDex(body){
  var html = '<div class="grid">';
  for(var i = 0; i < SPECIES.length; i++){
    var sp = SPECIES[i];
    var found = state.player.discovered[sp.id];
    if(!found){
      html += '<div class="ccard" style="opacity:.55">'
        + '<div style="width:64px;height:64px;margin:0 auto 6px;display:flex;'
        + 'align-items:center;justify-content:center;background:#0b1020;'
        + 'border:1px dashed #1f2a4d;border-radius:12px;font-size:28px">?</div>'
        + '<div class="name">???</div>'
        + '<div class="sub">Não descoberta</div></div>';
    } else {
      html += '<div class="ccard">'
        + '<img src="' + creatureSVG(sp.id) + '" alt="' + sp.name + '"/>'
        + '<div class="name">' + sp.name + '</div>'
        + '<div class="sub">' + CONFIG.rarityLabel[sp.rarity] + ' · ' + sp.type + '</div>'
        + '</div>';
    }
  }
  html += '</div>';
  body.innerHTML = html;
}

function renderInventory(body){
  var labels = {
    capsule_basic:'🔴 Cápsula Básica',
    capsule_good:'🟠 Cápsula Boa',
    capsule_ultra:'🟣 Cápsula Ultra',
    capsule_master:'⚫ Cápsula Mestre'
  };
  var html = '';
  Object.keys(state.inventory).forEach(function(k){
    html += '<div class="invitem"><span>' + (labels[k] || k) + '</span>'
          + '<strong>' + state.inventory[k] + '</strong></div>';
  });
  body.innerHTML = html;
}

function renderProfile(body){
  var p = state.player;
  var discoveredCount = Object.keys(p.discovered).length;
  body.innerHTML =
    '<div style="text-align:center;margin-bottom:20px">'
    + '<div style="width:80px;height:80px;margin:0 auto 10px;border-radius:20px;'
    + 'background:linear-gradient(135deg,#22d3ee,#a78bfa);'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'font-size:36px;font-weight:900;color:#0b1020">' + p.level + '</div>'
    + '<div style="font-size:20px;font-weight:700">Treinador</div>'
    + '<div style="color:#94a3b8;font-size:13px">Nível ' + p.level + '</div></div>'
    + '<div class="invitem"><span>XP atual</span><strong>' + p.xp + ' / ' + xpForLevel(p.level) + '</strong></div>'
    + '<div class="invitem"><span>🪙 Moedas</span><strong>' + p.coins + '</strong></div>'
    + '<div class="invitem"><span>🐾 Capturadas</span><strong>' + p.capturedCount + '</strong></div>'
    + '<div class="invitem"><span>📖 Descobertas</span><strong>' + discoveredCount + ' / ' + SPECIES.length + '</strong></div>';
}

/* ---------- GEOLOCALIZAÇÃO ---------- */
function locateMe(){
  if(!navigator.geolocation){
    showToast('Geolocalização indisponível. Centralizando no demo.');
    if(state.map) state.map.easeTo({ center:[state.player.lng, state.player.lat], zoom:16, duration:600 });
    return;
  }
  showToast('Buscando sua localização...', 1500);
  navigator.geolocation.getCurrentPosition(
    function(pos){
      state.player.lat = pos.coords.latitude;
      state.player.lng = pos.coords.longitude;
      if(state.playerMarker) state.playerMarker.setLngLat([state.player.lng, state.player.lat]);
      if(state.map) state.map.easeTo({
        center: [state.player.lng, state.player.lat],
        zoom: 16,
        duration: 800
      });
      showToast('📍 Localização atualizada!');
      ensureSpawns();
    },
    function(err){
      console.warn('geo error', err);
      showToast('Permissão negada. Centralizando no demo (São Paulo).');
      if(state.map) state.map.easeTo({
        center: [state.player.lng, state.player.lat],
        zoom: 15,
        duration: 600
      });
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function updatePlayerPosition(lat, lng, recenter){
  var prev = { lat: state.player.lat, lng: state.player.lng };
  var dist = distanceMeters(prev, { lat: lat, lng: lng });

  // Atualiza SEMPRE a posição (mesmo se for a mesma)
  state.player.lat = lat;
  state.player.lng = lng;

  if(state.playerMarker) state.playerMarker.setLngLat([lng, lat]);
  if(recenter && state.map) state.map.easeTo({ center: [lng, lat], duration: 600 });

  // XP por exploração só se moveu o suficiente
  if(dist > 20 && dist < 500){
    var xpGain = Math.floor(dist / 100) * 5;
    if(xpGain > 0) gainXp(xpGain);
  }

  // Só checa spawn se realmente se moveu
  if(dist > 5) ensureSpawns();
}

function watchGeolocation(){
  if(!navigator.geolocation) return;
  navigator.geolocation.watchPosition(
    function(pos){
      updatePlayerPosition(pos.coords.latitude, pos.coords.longitude, false);
    },
    function(){},
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

/* ---------- EXPLORAR ---------- */
function forceSpawn(){
  if(state.spawns.length >= CONFIG.maxSpawns){
    showToast('Muitas criaturas por perto. Capture algumas primeiro!');
    return;
  }
  var sp = generateSpawn();
  state.spawns.push(sp);
  renderSpawnMarker(sp);
  showToast('🧭 Você explorou a área...');
}

/* ---------- BOOT ---------- */
function startGame(useRealLocation){
  document.getElementById('landing').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  document.getElementById('bottom').style.display = 'flex';

  load();
  updateHUD();
  initMap();

  if(useRealLocation){
    setTimeout(function(){
      locateMe();
      watchGeolocation();
    }, 1500);
  }
}

window.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    closeEncounter();
    closeDrawer();
  }
});