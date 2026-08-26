/* ==========================================================================
   FOOTBALL LEGENDS - GAMEPLAY & FUT ENGINE (game.js)
   ========================================================================== */

// --- EXTENDED PLAYER DATABASE WITH REAL CUTOUT HEADSHOTS ---
const PLAYER_DATABASE = [
  // Icon / Legendary Tier (5% Pack Rate)
  { id: 'p1', name: 'PELÉ', rating: 98, pos: 'CAM', tier: 'icon', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Pel%C3%A9_1966.png', pac: 95, sho: 96, pas: 93 },
  { id: 'p2', name: 'MARADONA', rating: 97, pos: 'CAM', tier: 'icon', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Maradona-1986-argentina-sweden.png', pac: 92, sho: 93, pas: 95 },
  { id: 'p3', name: 'CRUYFF', rating: 94, pos: 'CF', tier: 'icon', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Johan_Cruijff_%281974%29.png', pac: 91, sho: 92, pas: 91 },
  
  // Elite Tier (15% Pack Rate)
  { id: 'p4', name: 'MBAPPÉ', rating: 92, pos: 'ST', tier: 'elite', image: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Kylian_Mbapp%C3%A9_2019.png', pac: 97, sho: 89, pas: 80 },
  { id: 'p5', name: 'MESSI', rating: 91, pos: 'RW', tier: 'elite', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.png', pac: 85, sho: 92, pas: 91 },
  { id: 'p6', name: 'RONALDO', rating: 90, pos: 'ST', tier: 'elite', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.png', pac: 87, sho: 92, pas: 78 },
  { id: 'p7', name: 'HAALAND', rating: 91, pos: 'ST', tier: 'elite', image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Erling_Haaland_2023.png', pac: 89, sho: 93, pas: 65 },

  // Gold Tier (80% Pack Rate)
  { id: 'p8', name: 'DE BRUYNE', rating: 91, pos: 'CM', tier: 'gold', image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_2018.png', pac: 74, sho: 88, pas: 93 },
  { id: 'p9', name: 'SALAH', rating: 89, pos: 'RW', tier: 'gold', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.png', pac: 90, sho: 87, pas: 81 },
  { id: 'p10', name: 'VINICIUS JR', rating: 89, pos: 'LW', tier: 'gold', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Vinicius_Junior_2021.png', pac: 95, sho: 82, pas: 78 },
  { id: 'p11', name: 'BELLINGHAM', rating: 88, pos: 'CAM', tier: 'gold', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Jude_Bellingham_2023.png', pac: 80, sho: 85, pas: 83 },
  { id: 'p12', name: 'VAN DIJK', rating: 89, pos: 'CB', tier: 'gold', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Virgil_van_Dijk_2018.png', pac: 78, sho: 60, pas: 71 }
];

// Global State
const state = {
  coins: 15000,
  squad: [
    PLAYER_DATABASE[7], // De Bruyne
    PLAYER_DATABASE[6]  // Haaland
  ],
  score: { home: 0, away: 0 }
};

// --- NAVIGATION & UI ENGINE ---
function navigateTo(pageId) {
  if (!pageId) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

function updateCoinsDisplay() {
  const coinEl = document.getElementById('coin-count');
  if (coinEl) coinEl.innerText = `🪙 ${state.coins.toLocaleString()}`;
}

function renderSquad() {
  const container = document.getElementById('squad-container');
  if (!container) return;
  container.innerHTML = state.squad.map(p => `
    <div class="fut-card ${p.tier}">
      <div class="card-top">
        <span class="card-rating">${p.rating}</span>
        <span class="card-position">${p.pos}</span>
      </div>
      <img class="card-image" src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="card-name">${p.name}</div>
      <div class="card-stats">
        <div>PAC <span>${p.pac}</span></div>
        <div>SHO <span>${p.sho}</span></div>
        <div>PAS <span>${p.pas}</span></div>
      </div>
    </div>
  `).join('');
}

// --- RANDOMIZED PACK OPENING SYSTEM (PROBABILITY-BASED) ---
function openPack() {
  const PACK_COST = 1000;
  if (state.coins < PACK_COST) {
    alert("Not enough coins to open a pack!");
    return;
  }

  state.coins -= PACK_COST;
  updateCoinsDisplay();

  // Calculate Tier based on odds: 80% Gold, 15% Elite, 5% Icon
  const rand = Math.random() * 100;
  let selectedTier = 'gold';
  if (rand > 95) {
    selectedTier = 'icon';
  } else if (rand > 80) {
    selectedTier = 'elite';
  }

  const tierPool = PLAYER_DATABASE.filter(p => p.tier === selectedTier);
  const pulledPlayer = tierPool[Math.floor(Math.random() * tierPool.length)];

  // Add to squad
  state.squad.push(pulledPlayer);
  renderSquad();

  // Render Pack Modal Animation
  const overlay = document.getElementById('pack-overlay');
  overlay.innerHTML = `
    <div class="pack-reveal-title">NEW PLAYER UNLOCKED!</div>
    <div class="fut-card ${pulledPlayer.tier} reveal-card">
      <div class="card-top">
        <span class="card-rating">${pulledPlayer.rating}</span>
        <span class="card-position">${pulledPlayer.pos}</span>
      </div>
      <img class="card-image" src="${pulledPlayer.image}" alt="${pulledPlayer.name}" />
      <div class="card-name">${pulledPlayer.name}</div>
      <div class="card-stats">
        <div>PAC <span>${pulledPlayer.pac}</span></div>
        <div>SHO <span>${pulledPlayer.sho}</span></div>
        <div>PAS <span>${pulledPlayer.pas}</span></div>
      </div>
    </div>
    <button class="claim-btn" id="close-pack-btn">ADD TO SQUAD</button>
  `;

  overlay.classList.add('active');
  document.getElementById('close-pack-btn').addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

/* ==========================================================================
   ENHANCED 3D MATCH ENGINE (THREE.JS ARTICULATED PLAYER MODELS)
   ========================================================================== */

let scene, camera, renderer;
let playerGroup, defenderGroup, goalkeeperGroup, ball;
let keys = {};
let isMatchActive = false;

let ballVelocity = { x: 0, y: 0, z: 0 };
let playerFacing = { x: 0, z: -1 };
let shootPower = 0;
let isChargingShoot = false;
const FIELD_WIDTH = 60;
const FIELD_LENGTH = 90;

// Helper: Construct an articulated kit player model
function createDetailedPlayerModel(jerseyColorHex, shortsColorHex) {
  const group = new THREE.Group();

  // Torso / Jersey
  const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.5);
  const torsoMat = new THREE.MeshStandardMaterial({ color: jerseyColorHex, roughness: 0.5 });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.8 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.95;
  head.castShadow = true;
  group.add(head);

  // Shorts
  const shortsGeo = new THREE.BoxGeometry(0.92, 0.4, 0.52);
  const shortsMat = new THREE.MeshStandardMaterial({ color: shortsColorHex, roughness: 0.6 });
  const shorts = new THREE.Mesh(shortsGeo, shortsMat);
  shorts.position.y = 0.45;
  shorts.castShadow = true;
  group.add(shorts);

  // Left & Right Legs
  const legGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.6, 12);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
  
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.25, -0.05, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.25, -0.05, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  return group;
}

function init3DMatch() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  container.innerHTML = '';

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a0e);
  scene.fog = new THREE.FogExp2(0x070a0e, 0.015);

  // 2. Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 24, 34);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const stadiumLight = new THREE.DirectionalLight(0xffffff, 0.9);
  stadiumLight.position.set(20, 45, 15);
  stadiumLight.castShadow = true;
  stadiumLight.shadow.mapSize.width = 2048;
  stadiumLight.shadow.mapSize.height = 2048;
  scene.add(stadiumLight);

  // 5. Pitch
  const pitchGeo = new THREE.PlaneGeometry(FIELD_WIDTH, FIELD_LENGTH);
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0x1e6b27, roughness: 0.7 });
  const pitch = new THREE.Mesh(pitchGeo, pitchMat);
  pitch.rotation.x = -Math.PI / 2;
  pitch.receiveShadow = true;
  scene.add(pitch);

  createGoal(0, -FIELD_LENGTH / 2 + 1);

  // 6. User Controlled Player (Green Kit)
  playerGroup = createDetailedPlayerModel(0x00ff66, 0x111111);
  playerGroup.position.set(0, 0.3, 15);
  scene.add(playerGroup);

  // 7. Defender AI Player (Red Kit)
  defenderGroup = createDetailedPlayerModel(0xef4444, 0xffffff);
  defenderGroup.position.set(5, 0.3, -5);
  scene.add(defenderGroup);

  // 8. Goalkeeper AI Player (Yellow Kit)
  goalkeeperGroup = createDetailedPlayerModel(0xeab308, 0x111111);
  goalkeeperGroup.position.set(0, 0.3, -FIELD_LENGTH / 2 + 3);
  scene.add(goalkeeperGroup);

  // 9. Ball
  const ballGeo = new THREE.SphereGeometry(0.45, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, 0.45, 10);
  ball.castShadow = true;
  scene.add(ball);

  ballVelocity = { x: 0, y: 0, z: 0 };
  isMatchActive = true;
  animate3D();
}

function createGoal(x, z) {
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  
  const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 16), postMat);
  leftPost.position.set(x - 6, 2, z);
  scene.add(leftPost);

  const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 16), postMat);
  rightPost.position.set(x + 6, 2, z);
  scene.add(rightPost);

  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 12, 16), postMat);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(x, 4, z);
  scene.add(crossbar);
}

// --- GAMEPLAY LOOP ---
function animate3D() {
  if (!isMatchActive) return;
  requestAnimationFrame(animate3D);

  // 1. Movement
  const isSprinting = keys['shift'];
  const moveSpeed = isSprinting ? 0.25 : 0.15;
  let dx = 0;
  let dz = 0;

  if (keys['w'] || keys['arrowup']) dz -= 1;
  if (keys['s'] || keys['arrowdown']) dz += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 || dz !== 0) {
    const len = Math.sqrt(dx * dx + dz * dz);
    dx /= len;
    dz /= len;

    playerGroup.position.x += dx * moveSpeed;
    playerGroup.position.z += dz * moveSpeed;

    playerFacing.x = dx;
    playerFacing.z = dz;

    // Rotate player mesh toward direction of travel
    playerGroup.rotation.y = Math.atan2(dx, dz);
  }

  // Pitch Boundaries
  playerGroup.position.x = Math.max(-FIELD_WIDTH / 2 + 1, Math.min(FIELD_WIDTH / 2 - 1, playerGroup.position.x));
  playerGroup.position.z = Math.max(-FIELD_LENGTH / 2 + 1, Math.min(FIELD_LENGTH / 2 - 1, playerGroup.position.z));

  // 2. Dribbling physics
  const distToBall = playerGroup.position.distanceTo(ball.position);
  const dribbleDistance = isSprinting ? 1.7 : 1.2;

  if (distToBall < dribbleDistance) {
    const pushAngle = Math.atan2(playerFacing.z, playerFacing.x);
    const targetX = playerGroup.position.x + Math.cos(pushAngle) * (dribbleDistance * 0.9);
    const targetZ = playerGroup.position.z + Math.sin(pushAngle) * (dribbleDistance * 0.9);

    ball.position.x += (targetX - ball.position.x) * 0.35;
    ball.position.z += (targetZ - ball.position.z) * 0.35;
  }

  // 3. Charging Shoot
  if (keys['k'] || keys['shoot_held']) {
    isChargingShoot = true;
    shootPower = Math.min(shootPower + 0.035, 1.0);
  } else if (isChargingShoot) {
    executeShot(shootPower);
    shootPower = 0;
    isChargingShoot = false;
  }

  // 4. Ball Physics & Air Friction
  ball.position.x += ballVelocity.x;
  ball.position.y += ballVelocity.y;
  ball.position.z += ballVelocity.z;

  ballVelocity.x *= 0.96;
  ballVelocity.z *= 0.96;

  if (ball.position.y > 0.45) {
    ballVelocity.y -= 0.025;
  } else {
    ball.position.y = 0.45;
    ballVelocity.y = -ballVelocity.y * 0.35;
    if (Math.abs(ballVelocity.y) < 0.02) ballVelocity.y = 0;
  }

  // 5. Goal Check
  if (ball.position.z < -FIELD_LENGTH / 2 + 1.5 && Math.abs(ball.position.x) < 5.8 && ball.position.y < 4.0) {
    state.score.home += 1;
    document.getElementById('match-score').innerText = `${state.score.home} - ${state.score.away}`;
    resetPositions();
  }

  // 6. Defender & GK AI
  if (ball.position.z < 10) {
    const defSpeed = 0.085;
    const defAngle = Math.atan2(ball.position.z - defenderGroup.position.z, ball.position.x - defenderGroup.position.x);
    defenderGroup.position.x += Math.cos(defAngle) * defSpeed;
    defenderGroup.position.z += Math.sin(defAngle) * defSpeed;
    defenderGroup.rotation.y = Math.atan2(Math.cos(defAngle), Math.sin(defAngle));
  }

  const targetGKX = Math.max(-5, Math.min(5, ball.position.x * 0.6));
  goalkeeperGroup.position.x += (targetGKX - goalkeeperGroup.position.x) * 0.08;

  // 7. Tele Broadcast Camera Tracking
  const camTargetX = playerGroup.position.x * 0.35;
  const camTargetZ = playerGroup.position.z + 20;

  camera.position.x += (camTargetX - camera.position.x) * 0.05;
  camera.position.z += (camTargetZ - camera.position.z) * 0.05;
  camera.lookAt(playerGroup.position.x * 0.2, 0, playerGroup.position.z * 0.2 - 5);

  renderer.render(scene, camera);
}

function executeShot(power) {
  if (!playerGroup || !ball || playerGroup.position.distanceTo(ball.position) > 2.5) return;

  const baseSpeed = 0.6 + power * 0.85;
  const liftForce = 0.15 + power * 0.45;

  const dx = 0 - ball.position.x;
  const dz = (-FIELD_LENGTH / 2) - ball.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  ballVelocity.x = (dx / dist) * baseSpeed;
  ballVelocity.z = (dz / dist) * baseSpeed;
  ballVelocity.y = liftForce;
}

function executePass() {
  if (!playerGroup || !ball || playerGroup.position.distanceTo(ball.position) > 2.5) return;

  const passSpeed = 0.6;
  ballVelocity.x = playerFacing.x * passSpeed;
  ballVelocity.z = playerFacing.z * passSpeed;
  ballVelocity.y = 0.02;
}

function resetPositions() {
  playerGroup.position.set(0, 0.3, 15);
  defenderGroup.position.set(5, 0.3, -5);
  goalkeeperGroup.position.set(0, 0.3, -FIELD_LENGTH / 2 + 3);
  ball.position.set(0, 0.45, 10);
  ballVelocity = { x: 0, y: 0, z: 0 };
}

// --- INIT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  updateCoinsDisplay();
  renderSquad();

  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) navigateTo(target.getAttribute('data-page'));
  });

  window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'j') executePass();
  });

  document.getElementById('start-match-btn')?.addEventListener('click', () => {
    document.getElementById('match-screen').classList.add('active');
    setTimeout(init3DMatch, 50);
  });

  document.getElementById('exit-match-btn')?.addEventListener('click', () => {
    isMatchActive = false;
    document.getElementById('match-screen').classList.remove('active');
  });

  document.getElementById('open-pack-btn')?.addEventListener('click', openPack);
});
