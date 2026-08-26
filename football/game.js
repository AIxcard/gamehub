const state = {
  squad: [
    { name: 'HAALAND', rating: 91, pos: 'ST', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', pac: 89, sho: 93, pas: 75 },
    { name: 'DE BRUYNE', rating: 91, pos: 'CM', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150', pac: 76, sho: 88, pas: 93 }
  ]
};

// PAGE ROUTER
function navigateTo(pageId) {
  if (!pageId) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

// RENDER SQUAD
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

// PACK OPENING
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

// THREE.JS 3D ENGINE
let scene, camera, renderer, player, ball;
let keys = {};
let ballVelocity = { x: 0, y: 0, z: 0 };
let isMatchActive = false;

function init3DMatch() {
  const container = document.getElementById('canvas-container');
  container.innerHTML = '';

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a0e);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 18, 25);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(20, 40, 20);
  scene.add(light);

  // Pitch Ground
  const pitchGeo = new THREE.PlaneGeometry(60, 40);
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0x155229 });
  const pitch = new THREE.Mesh(pitchGeo, pitchMat);
  pitch.rotation.x = -Math.PI / 2;
  scene.add(pitch);

  // Player Mesh
  const playerGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.8, 16);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff66 });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(0, 0.9, 5);
  scene.add(player);

  // Ball Mesh
  const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, 0.4, 0);
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

  // Dribbling collision
  const dist = player.position.distanceTo(ball.position);
  if (dist < 1.2) {
    const angle = Math.atan2(ball.position.z - player.position.z, ball.position.x - player.position.x);
    ball.position.x = player.position.x + Math.cos(angle) * 1.1;
    ball.position.z = player.position.z + Math.sin(angle) * 1.1;
  }

  // Ball Movement
  ball.position.x += ballVelocity.x;
  ball.position.y += ballVelocity.y;
  ball.position.z += ballVelocity.z;

  if (ball.position.y > 0.4) ballVelocity.y -= 0.02;
  else { ball.position.y = 0.4; ballVelocity.y = 0; }
  ballVelocity.x *= 0.95;
  ballVelocity.z *= 0.95;

  // Camera Follow
  camera.position.x = player.position.x * 0.4;
  camera.position.z = player.position.z + 18;
  camera.lookAt(player.position.x * 0.2, 0, player.position.z * 0.2);

  renderer.render(scene, camera);
}

// EVENT INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderSquad();

  // Navigation
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) navigateTo(target.getAttribute('data-page'));
  });

  // Keyboard controls
  window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  // Touch controls
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

  // Start 3D Match
  document.getElementById('start-match-btn')?.addEventListener('click', () => {
    const matchScreen = document.getElementById('match-screen');
    matchScreen.classList.add('active');
    setTimeout(init3DMatch, 50); // Small delay to guarantee container exists in DOM before rendering
  });

  // Exit 3D Match
  document.getElementById('exit-match-btn')?.addEventListener('click', () => {
    isMatchActive = false;
    document.getElementById('match-screen').classList.remove('active');
  });

  // Action Buttons
  document.getElementById('btn-shoot')?.addEventListener('click', () => {
    if (player && ball && player.position.distanceTo(ball.position) < 2.0) {
      ballVelocity.z = -0.8;
      ballVelocity.y = 0.3;
    }
  });

  document.getElementById('btn-pass')?.addEventListener('click', () => {
    if (player && ball && player.position.distanceTo(ball.position) < 2.0) {
      ballVelocity.z = -0.5;
      ballVelocity.y = 0.05;
    }
  });

  document.getElementById('open-pack-btn')?.addEventListener('click', openPack);
});
