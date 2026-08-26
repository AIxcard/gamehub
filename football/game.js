/* =========================================================
   FOOTBALL LEGENDS 3D - COMPLETE ENGINE & ROUTER
   ========================================================= */

// --- STATE MANAGEMENT ---
const state = {
  squad: [
    { name: 'HAALAND', rating: 91, pos: 'ST', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', pac: 89, sho: 93, pas: 75 },
    { name: 'DE BRUYNE', rating: 91, pos: 'CM', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150', pac: 76, sho: 88, pas: 93 }
  ]
};

// --- DOM ROUTER ---
function navigateTo(pageId) {
  if (!pageId) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links button').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

// --- RENDER CARDS ---
function renderSquad() {
  const container = document.getElementById('squad-container');
  if (!container) return;
  container.innerHTML = state.squad.map(player => `
    <div class="fut-card">
      <div class="card-top">
        <div>
          <div class="card-rating">${player.rating}</div>
          <div class="card-position">${player.pos}</div>
        </div>
      </div>
      <img class="card-image" src="${player.image}" alt="${player.name}" />
      <div class="card-name">${player.name}</div>
      <div class="card-stats">
        <div>PAC <span>${player.pac}</span></div>
        <div>SHO <span>${player.sho}</span></div>
        <div>PAS <span>${player.pas}</span></div>
      </div>
    </div>
  `).join('');
}

// --- PACK ANIMATION SYSTEM ---
function openPack() {
  const overlay = document.getElementById('pack-overlay');
  const newPlayer = {
    name: 'MBAPPÉ', rating: 92, pos: 'ST',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150',
    pac: 97, sho: 89, pas: 80
  };

  overlay.innerHTML = `
    <div class="fut-card pack-card-reveal">
      <div class="card-top">
        <div>
          <div class="card-rating">${newPlayer.rating}</div>
          <div class="card-position">${newPlayer.pos}</div>
        </div>
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

// --- 3D THREE.JS MATCH ENGINE ---
let scene, camera, renderer, player, ball;
let keys = {};
let ballVelocity = { x: 0, y: 0, z: 0 };
let isMatchActive = false;

function init3DMatch() {
  const container = document.getElementById('canvas-container');
  container.innerHTML = '';

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a0e);
  scene.fog = new THREE.FogExp2(0x070a0e, 0.015);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 18, 25);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(20, 40, 20);
  light.castShadow = true;
  scene.add(light);

  // 3D Pitch Ground
  const pitchGeo = new THREE.PlaneGeometry(60, 40);
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0x155229, roughness: 0.6 });
  const pitch = new THREE.Mesh(pitchGeo, pitchMat);
  pitch.rotation.x = -Math.PI / 2;
  pitch.receiveShadow = true;
  scene.add(pitch);

  // 3D Player Character
  const playerGeo = new THREE.CapsuleGeometry(0.6, 1.2, 8, 16);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff66, roughness: 0.3 });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(0, 1.2, 5);
  player.castShadow = true;
  scene.add(player);

  // 3D Soccer Ball
  const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, 0.4, 0);
  ball.castShadow = true;
  scene.add(ball);

  isMatchActive = true;
  animate3D();
}

function animate3D() {
  if (!isMatchActive) return;
  requestAnimationFrame(animate3D);

  const speed = 0.15;
  if (keys['w'] || keys['arrowup']) player.position.z -= speed;
  if (keys['s'] || keys['arrowdown']) player.position.z += speed;
  if (keys['a'] || keys['arrowleft']) player.position.x -= speed;
  if (keys['d'] || keys['arrowright']) player.position.x += speed;

  // Pitch Boundaries
  player.position.x = Math.max(-28, Math.min(28, player.position.x));
  player.position.z = Math.max(-18, Math.min(18, player.position.z));

  // Ball Dribble Physics
  const dist = player.position.distanceTo(ball.position);
  if (dist < 1.2) {
    const angle = Math.atan2(ball.position.z - player.position.z, ball.position.x - player.position.x);
    ball.position.x = player.position.x + Math.cos(angle) * 1.1;
    ball.position.z = player.position.z + Math.sin(angle) * 1.1;
  }

  // Ball Physics
  ball.position.x += ballVelocity.x;
  ball.position.y += ballVelocity.y;
  ball.position.z += ballVelocity.z;

  if (ball.position.y > 0.4) ballVelocity.y -= 0.02;
  else { ball.position.y = 0.4; ballVelocity.y = 0; }
  ballVelocity.x *= 0.95;
  ballVelocity.z *= 0.95;

  // Broadcast Camera Follow
  camera.position.x = player.position.x * 0.4;
  camera.position.z = player.position.z + 18;
  camera.lookAt(player.position.x * 0.2, 0, player.position.z * 0.2);

  renderer.render(scene, camera);
}

// --- INITIALIZATION & EVENTS ---
document.addEventListener('DOMContentLoaded', () => {
  renderSquad();

  // Navigation Click Handler
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) navigateTo(target.getAttribute('data-page'));
  });

  // Controls Listener
  window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  // Mobile Touch Controls
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

  // Match Actions
  document.getElementById('start-match-btn')?.addEventListener('click', () => {
    document.getElementById('match-screen').classList.add('active');
    init3DMatch();
  });

  document.getElementById('exit-match-btn')?.addEventListener('click', () => {
    isMatchActive = false;
    document.getElementById('match-screen').classList.remove('active');
  });

  document.getElementById('btn-shoot')?.addEventListener('click', () => {
    if (player.position.distanceTo(ball.position) < 2.0) {
      ballVelocity.z = -0.8;
      ballVelocity.y = 0.3;
    }
  });

  document.getElementById('btn-pass')?.addEventListener('click', () => {
    if (player.position.distanceTo(ball.position) < 2.0) {
      ballVelocity.z = -0.5;
      ballVelocity.y = 0.05;
    }
  });

  document.getElementById('open-pack-btn')?.addEventListener('click', openPack);
});
