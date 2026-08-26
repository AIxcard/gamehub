/* ==========================================================================
   FOOTBALL LEGENDS 3D - GAMEPLAY ENGINE (game.js)
   Features: Dribbling, Powered Shooting/Passing, Broadcast Camera, Goal/AI
   ========================================================================== */

// --- GLOBAL GAME STATE ---
const state = {
  squad: [
    { name: 'HAALAND', rating: 91, pos: 'ST', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', pac: 89, sho: 93, pas: 75 },
    { name: 'DE BRUYNE', rating: 91, pos: 'CM', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150', pac: 76, sho: 88, pas: 93 }
  ],
  score: { home: 0, away: 0 }
};

// --- NAVIGATION SYSTEM ---
function navigateTo(pageId) {
  if (!pageId) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

// --- FUT SQUAD UI RENDERER ---
function renderSquad() {
  const container = document.getElementById('squad-container');
  if (!container) return;
  container.innerHTML = state.squad.map(p => `
    <div class="fut-card">
      <div class="card-top">
        <span class="card-rating">${p.rating}</span>
        <span class="card-position">${p.pos}</span>
      </div>
      <img class="card-image" src="${p.image}" alt="${p.name}" />
      <div class="card-name">${p.name}</div>
      <div class="card-stats">
        <div>PAC <span>${p.pac}</span></div>
        <div>SHO <span>${p.sho}</span></div>
        <div>PAS <span>${p.pas}</span></div>
      </div>
    </div>
  `).join('');
}

// --- PACK OPENING SYSTEM ---
function openPack() {
  const overlay = document.getElementById('pack-overlay');
  const newPlayer = {
    name: 'MBAPPÉ', rating: 92, pos: 'ST',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150',
    pac: 97, sho: 89, pas: 80
  };

  overlay.innerHTML = `
    <div class="fut-card">
      <div class="card-top">
        <span class="card-rating">${newPlayer.rating}</span>
        <span class="card-position">${newPlayer.pos}</span>
      </div>
      <img class="card-image" src="${newPlayer.image}" alt="${newPlayer.name}" />
      <div class="card-name">${newPlayer.name}</div>
      <div class="card-stats">
        <div>PAC <span>${newPlayer.pac}</span></div>
        <div>SHO <span>${newPlayer.sho}</span></div>
        <div>PAS <span>${newPlayer.pas}</span></div>
      </div>
    </div>
    <button class="claim-btn" id="close-pack-btn">CLAIM PLAYER</button>
  `;

  overlay.classList.add('active');
  state.squad.push(newPlayer);
  renderSquad();

  document.getElementById('close-pack-btn').addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

/* ==========================================================================
   3D ENGINE & GAMEPLAY PHYSICS (THREE.JS)
   ========================================================================== */

let scene, camera, renderer;
let player, defender, goalkeeper, ball;
let keys = {};
let isMatchActive = false;

// Physics Variables
let ballVelocity = { x: 0, y: 0, z: 0 };
let playerFacing = { x: 0, z: -1 };
let shootPower = 0;
let isChargingShoot = false;
const FIELD_WIDTH = 60;
const FIELD_LENGTH = 90;

function init3DMatch() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  container.innerHTML = '';

  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a0e);
  scene.fog = new THREE.FogExp2(0x070a0e, 0.015);

  // 2. Camera Setup (FIFA Tele Broadcast Style)
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 22, 32);

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // 4. Lights Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const stadiumLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  stadiumLight1.position.set(30, 40, 20);
  stadiumLight1.castShadow = true;
  scene.add(stadiumLight1);

  const stadiumLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
  stadiumLight2.position.set(-30, 40, -20);
  scene.add(stadiumLight2);

  // 5. Pitch Creation (Green grass + pitch markings)
  const pitchGeo = new THREE.PlaneGeometry(FIELD_WIDTH, FIELD_LENGTH);
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0x1a5e20, roughness: 0.8 });
  const pitch = new THREE.Mesh(pitchGeo, pitchMat);
  pitch.rotation.x = -Math.PI / 2;
  pitch.receiveShadow = true;
  scene.add(pitch);

  // Goal Post Creation (Away Goal)
  createGoal(0, -FIELD_LENGTH / 2 + 1);

  // 6. User Controlled Player (Green Cylinder)
  const playerGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff66 });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(0, 0.9, 15);
  player.castShadow = true;
  scene.add(player);

  // 7. Defender AI Player (Red Cylinder)
  const defenderMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
  defender = new THREE.Mesh(playerGeo, defenderMat);
  defender.position.set(5, 0.9, -5);
  defender.castShadow = true;
  scene.add(defender);

  // 8. Goalkeeper AI Player (Yellow Cylinder)
  const gkMat = new THREE.MeshStandardMaterial({ color: 0xeab308 });
  goalkeeper = new THREE.Mesh(playerGeo, gkMat);
  goalkeeper.position.set(0, 0.9, -FIELD_LENGTH / 2 + 3);
  goalkeeper.castShadow = true;
  scene.add(goalkeeper);

  // 9. Match Ball Creation
  const ballGeo = new THREE.SphereGeometry(0.45, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, 0.45, 10);
  ball.castShadow = true;
  scene.add(ball);

  // Reset states & trigger main loop
  ballVelocity = { x: 0, y: 0, z: 0 };
  isMatchActive = true;
  animate3D();
}

// Build goal posts and net frame
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

/* ==========================================================================
   MAIN GAMEPLAY LOOP (Physics, AI, Mechanics)
   ========================================================================== */

function animate3D() {
  if (!isMatchActive) return;
  requestAnimationFrame(animate3D);

  // --- 1. PLAYER MOVEMENT & SPRINT ---
  const isSprinting = keys['shift'];
  const moveSpeed = isSprinting ? 0.24 : 0.14;
  let dx = 0;
  let dz = 0;

  if (keys['w'] || keys['arrowup']) dz -= 1;
  if (keys['s'] || keys['arrowdown']) dz += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 || dz !== 0) {
    // Normalize directional vector
    const length = Math.sqrt(dx * dx + dz * dz);
    dx /= length;
    dz /= length;

    player.position.x += dx * moveSpeed;
    player.position.z += dz * moveSpeed;

    // Track direction facing
    playerFacing.x = dx;
    playerFacing.z = dz;
  }

  // Pitch Boundary Clamping for Player
  player.position.x = Math.max(-FIELD_WIDTH / 2 + 1, Math.min(FIELD_WIDTH / 2 - 1, player.position.x));
  player.position.z = Math.max(-FIELD_LENGTH / 2 + 1, Math.min(FIELD_LENGTH / 2 - 1, player.position.z));

  // --- 2. DRIBBLING & BALL TOUCH MECHANIC ---
  const playerToBallDist = player.position.distanceTo(ball.position);
  const dribbleDistance = isSprinting ? 1.6 : 1.1;

  if (playerToBallDist < dribbleDistance) {
    // Push ball in direction player is moving/facing
    const pushAngle = Math.atan2(playerFacing.z, playerFacing.x);
    const targetX = player.position.x + Math.cos(pushAngle) * (dribbleDistance * 0.9);
    const targetZ = player.position.z + Math.sin(pushAngle) * (dribbleDistance * 0.9);

    ball.position.x += (targetX - ball.position.x) * 0.3;
    ball.position.z += (targetZ - ball.position.z) * 0.3;
  }

  // --- 3. CHARGING SHOOT SYSTEM ---
  if (keys['k'] || keys['shoot_held']) {
    isChargingShoot = true;
    shootPower = Math.min(shootPower + 0.03, 1.0); // Charge power up to max 1.0
  } else if (isChargingShoot) {
    executeShot(shootPower);
    shootPower = 0;
    isChargingShoot = false;
  }

  // --- 4. BALL PHYSICS & GRAVITY ---
  ball.position.x += ballVelocity.x;
  ball.position.y += ballVelocity.y;
  ball.position.z += ballVelocity.z;

  // Air Resistance / Pitch Friction
  ballVelocity.x *= 0.96;
  ballVelocity.z *= 0.96;

  // Vertical Gravity and Bounce
  if (ball.position.y > 0.45) {
    ballVelocity.y -= 0.025; // Downward gravity force
  } else {
    ball.position.y = 0.45;
    ballVelocity.y = -ballVelocity.y * 0.4; // Soft floor bounce factor
    if (Math.abs(ballVelocity.y) < 0.02) ballVelocity.y = 0;
  }

  // --- 5. GOAL DETECTION ---
  if (ball.position.z < -FIELD_LENGTH / 2 + 1.5 && Math.abs(ball.position.x) < 5.8 && ball.position.y < 4.0) {
    state.score.home += 1;
    document.getElementById('match-score').innerText = `${state.score.home} - ${state.score.away}`;
    resetPositions();
  }

  // --- 6. DEFENDER & GOALKEEPER AI ---
  // Defender tracks ball when it enters defensive third
  if (ball.position.z < 10) {
    const defSpeed = 0.08;
    const defAngle = Math.atan2(ball.position.z - defender.position.z, ball.position.x - defender.position.x);
    defender.position.x += Math.cos(defAngle) * defSpeed;
    defender.position.z += Math.sin(defAngle) * defSpeed;
  }

  // Goalkeeper mirrors ball X position along the goal line
  const targetGKX = Math.max(-5, Math.min(5, ball.position.x * 0.6));
  goalkeeper.position.x += (targetGKX - goalkeeper.position.x) * 0.08;

  // --- 7. TELE BROADCAST CAMERA TRACKING ---
  const camTargetX = player.position.x * 0.35;
  const camTargetZ = player.position.z + 20;

  camera.position.x += (camTargetX - camera.position.x) * 0.05;
  camera.position.z += (camTargetZ - camera.position.z) * 0.05;
  camera.lookAt(player.position.x * 0.2, 0, player.position.z * 0.2 - 5);

  renderer.render(scene, camera);
}

/* ==========================================================================
   GAMEPLAY ACTIONS (Shooting, Passing, Reset)
   ========================================================================== */

function executeShot(power) {
  if (!player || !ball || player.position.distanceTo(ball.position) > 2.5) return;

  const baseSpeed = 0.6 + power * 0.8;
  const liftForce = 0.15 + power * 0.4;

  // Calculate forward vector aiming at goal
  const goalTargetX = 0;
  const goalTargetZ = -FIELD_LENGTH / 2;

  const dx = goalTargetX - ball.position.x;
  const dz = goalTargetZ - ball.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  ballVelocity.x = (dx / dist) * baseSpeed;
  ballVelocity.z = (dz / dist) * baseSpeed;
  ballVelocity.y = liftForce;
}

function executePass() {
  if (!player || !ball || player.position.distanceTo(ball.position) > 2.5) return;

  const passSpeed = 0.6;
  ballVelocity.x = playerFacing.x * passSpeed;
  ballVelocity.z = playerFacing.z * passSpeed;
  ballVelocity.y = 0.02; // Firm ground roll pass
}

function resetPositions() {
  player.position.set(0, 0.9, 15);
  defender.position.set(5, 0.9, -5);
  goalkeeper.position.set(0, 0.9, -FIELD_LENGTH / 2 + 3);
  ball.position.set(0, 0.45, 10);
  ballVelocity = { x: 0, y: 0, z: 0 };
}

/* ==========================================================================
   EVENT LISTENERS & BINDINGS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderSquad();

  // Navigation listener
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) navigateTo(target.getAttribute('data-page'));
  });

  // Keyboard controls
  window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  // Keyboard Shoot & Pass triggers
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'j') executePass();
  });

  // Mobile / Touch controls binding
  const bindTouch = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
  };

  bindTouch('btn-up', 'w');
  bindTouch('btn-down', 's');
  bindTouch('btn-left', 'a');
  bindTouch('btn-right', 'd');

  // Touch Action Buttons
  const shootBtn = document.getElementById('btn-shoot');
  if (shootBtn) {
    shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['shoot_held'] = true; });
    shootBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys['shoot_held'] = false; });
  }

  const passBtn = document.getElementById('btn-pass');
  if (passBtn) {
    passBtn.addEventListener('touchstart', (e) => { e.preventDefault(); executePass(); });
  }

  // Match Screen Trigger
  document.getElementById('start-match-btn')?.addEventListener('click', () => {
    const matchScreen = document.getElementById('match-screen');
    matchScreen.classList.add('active');
    setTimeout(init3DMatch, 50);
  });

  // Exit Match Screen
  document.getElementById('exit-match-btn')?.addEventListener('click', () => {
    isMatchActive = false;
    document.getElementById('match-screen').classList.remove('active');
  });

  // Pack Shop Trigger
  document.getElementById('open-pack-btn')?.addEventListener('click', openPack);
});
