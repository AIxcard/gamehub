/* =========================================================
   FOOTBALL LEGENDS - GAME ENGINE & APP CONTROLLER
   ========================================================= */

// --- STATE MANAGEMENT ---
const state = {
  coins: 1000,
  selectedTeam: 'red-dragons',
  selectedMode: 'quick-match',
  formation: '4-3-3',
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'medium',
  matchLength: 3,
  collection: [
    { id: 'p1', name: 'Erling Haaland', pos: 'ST', rating: 91, club: 'Manchester City' },
    { id: 'p2', name: 'Kevin De Bruyne', pos: 'CM', rating: 91, club: 'Manchester City' },
    { id: 'p3', name: 'Virgil van Dijk', pos: 'CB', rating: 89, club: 'Liverpool' },
    { id: 'p4', name: 'Alisson Becker', pos: 'GK', rating: 89, club: 'Liverpool' },
    { id: 'p5', name: 'Bukayo Saka', pos: 'RW', rating: 87, club: 'Arsenal' }
  ],
  squad: [
    { id: 'p1', name: 'Erling Haaland', pos: 'ST', rating: 91, x: 50, y: 20 },
    { id: 'p2', name: 'Kevin De Bruyne', pos: 'CM', rating: 91, x: 50, y: 50 },
    { id: 'p3', name: 'Virgil van Dijk', pos: 'CB', rating: 89, x: 50, y: 75 },
    { id: 'p4', name: 'Alisson Becker', pos: 'GK', rating: 89, x: 50, y: 90 }
  ]
};

// --- DOM ELEMENTS ---
const elements = {
  pages: document.querySelectorAll('.page'),
  navButtons: document.querySelectorAll('.nav-links button, .brand'),
  currencyDisplay: document.querySelector('.currency span'),
  squadPitch: document.querySelector('.starting-xi'),
  playerList: document.querySelector('.player-list'),
  collectionGrid: document.querySelector('.collection-grid'),
  matchScreen: document.querySelector('.match-screen'),
  goalMessage: document.querySelector('.goal-message'),
  staminaFill: document.querySelector('.stamina-fill'),
  homeScore: document.querySelector('.score-team.home strong'),
  awayScore: document.querySelector('.score-team.away strong'),
  matchTime: document.querySelector('.score-middle strong'),
  packResult: document.querySelector('.pack-result'),
  packResultBox: document.querySelector('.pack-result-box')
};

// --- NAVIGATION CONTROLLER ---
function navigateTo(pageId) {
  elements.pages.forEach(page => page.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function updateCurrency(amount) {
  state.coins += amount;
  if (elements.currencyDisplay) {
    elements.currencyDisplay.textContent = state.coins.toLocaleString();
  }
}

// --- SQUAD MANAGEMENT ---
function renderSquad() {
  if (!elements.squadPitch || !elements.playerList) return;

  // Render Pitch
  elements.squadPitch.innerHTML = state.squad.map(player => `
    <div class="formation-player" style="left: ${player.x}%; top: ${player.y}%;">
      <div class="formation-player-dot">${player.rating}</div>
      <span class="formation-player-name">${player.name}</span>
    </div>
  `).join('');

  // Render List
  elements.playerList.innerHTML = state.collection.map(player => `
    <div class="player-row">
      <div class="player-mini-card">
        <strong>${player.rating}</strong>
        <small>${player.pos}</small>
      </div>
      <div class="player-row-info">
        <strong>${player.name}</strong>
        <span>${player.club}</span>
      </div>
      <button class="squad-action" onclick="toggleSquadMember('${player.id}')">
        ${state.squad.some(s => s.id === player.id) ? 'REMOVE' : 'ADD'}
      </button>
    </div>
  `).join('');
}

function toggleSquadMember(id) {
  const index = state.squad.findIndex(s => s.id === id);
  if (index > -1) {
    state.squad.splice(index, 1);
  } else {
    const player = state.collection.find(c => c.id === id);
    if (player && state.squad.length < 11) {
      state.squad.push({ ...player, x: 50, y: 50 });
    }
  }
  renderSquad();
}

// --- PACK OPENING SYSTEM ---
const PACK_POOL = [
  { name: 'Kylian Mbappé', pos: 'ST', rating: 91, club: 'Real Madrid' },
  { name: 'Jude Bellingham', pos: 'CAM', rating: 90, club: 'Real Madrid' },
  { name: 'Rodri', pos: 'CDM', rating: 91, club: 'Manchester City' },
  { name: 'Lamine Yamal', pos: 'RW', rating: 88, club: 'FC Barcelona' },
  { name: 'Harry Kane', pos: 'ST', rating: 90, club: 'Bayern Munich' }
];

function openPack(cost) {
  if (state.coins < cost) {
    alert('Not enough coins!');
    return;
  }

  updateCurrency(-cost);
  const pulledPlayer = PACK_POOL[Math.floor(Math.random() * PACK_POOL.length)];
  const newPlayer = { ...pulledPlayer, id: 'p_' + Date.now() };

  state.collection.push(newPlayer);
  renderCollection();
  renderSquad();

  // Show Pack Animation Result
  if (elements.packResult && elements.packResultBox) {
    elements.packResultBox.innerHTML = `
      <div class="card-rating">${newPlayer.rating}</div>
      <div class="card-position">${newPlayer.pos}</div>
      <h2>${newPlayer.name}</h2>
      <p>${newPlayer.club}</p>
      <button class="primary-button" onclick="closePackResult()" style="margin: 20px auto 0;">CLAIM</button>
    `;
    elements.packResult.classList.add('show');
  }
}

function closePackResult() {
  if (elements.packResult) {
    elements.packResult.classList.remove('show');
  }
}

function renderCollection() {
  if (!elements.collectionGrid) return;
  elements.collectionGrid.innerHTML = state.collection.map(player => `
    <div class="collection-card">
      <div class="card-rating">${player.rating}</div>
      <div class="card-position">${player.pos}</div>
      <div class="card-avatar">${player.name.charAt(0)}</div>
      <h4>${player.name}</h4>
      <p>${player.club}</p>
    </div>
  `).join('');
}

// --- MATCH ENGINE (CANVAS SIMULATION) ---
class MatchEngine {
  constructor() {
    this.canvas = document.getElementById('match-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.keys = {};
    
    this.player = { x: 200, y: 300, vx: 0, vy: 0, speed: 4, radius: 12, stamina: 100 };
    this.ball = { x: 400, y: 300, vx: 0, vy: 0, radius: 8 };
    this.score = { home: 0, away: 0 };
    this.time = 0;

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);
  }

  start() {
    if (!this.canvas) return;
    this.resize();
    this.isRunning = true;
    this.score = { home: 0, away: 0 };
    this.time = 0;
    this.player.x = this.canvas.width / 4;
    this.player.y = this.canvas.height / 2;
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;

    elements.matchScreen.classList.add('active');
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
    elements.matchScreen.classList.remove('active');
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  update() {
    // Controls
    let dx = 0, dy = 0;
    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // Normalize Speed
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.player.x += dx * this.player.speed;
    this.player.y += dy * this.player.speed;

    // Ball Physics
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
    this.ball.vx *= 0.98;
    this.ball.vy *= 0.98;

    // Player-Ball Collision
    const dist = Math.hypot(this.player.x - this.ball.x, this.player.y - this.ball.y);
    if (dist < this.player.radius + this.ball.radius) {
      this.ball.vx = dx * (this.player.speed + 2);
      this.ball.vy = dy * (this.player.speed + 2);

      // Kick action
      if (this.keys[' ']) {
        this.ball.vx = 15;
        this.ball.vy = (Math.random() - 0.5) * 5;
      }
    }

    // Boundary Collisions
    this.player.x = Math.max(15, Math.min(this.canvas.width - 15, this.player.x));
    this.player.y = Math.max(15, Math.min(this.canvas.height - 15, this.player.y));

    // Goal Check
    if (this.ball.x > this.canvas.width - 20 && Math.abs(this.ball.y - this.canvas.height / 2) < 80) {
      this.triggerGoal('home');
    }

    // Match Time Update
    this.time += 0.016;
    if (elements.matchTime) {
      const minutes = Math.floor(this.time);
      elements.matchTime.textContent = `${minutes}'`;
    }
  }

  triggerGoal(team) {
    if (team === 'home') this.score.home++;
    else this.score.away++;

    if (elements.homeScore) elements.homeScore.textContent = this.score.home;
    if (elements.awayScore) elements.awayScore.textContent = this.score.away;

    if (elements.goalMessage) {
      elements.goalMessage.classList.add('show');
      setTimeout(() => elements.goalMessage.classList.remove('show'), 1500);
    }

    // Reset positions
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Pitch Markings
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 3;

    // Halfway line & Center circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 70, 0, Math.PI * 2);
    this.ctx.stroke();

    // Goal Areas
    this.ctx.strokeRect(this.canvas.width - 60, this.canvas.height / 2 - 80, 60, 160);

    // Draw Player
    this.ctx.fillStyle = '#19d66b';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw Ball
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }
}

const matchEngine = new MatchEngine();

// --- EVENT BINDINGS & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderCollection();
  renderSquad();

  // Handle Navigation Links
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      navigateTo(button.getAttribute('data-page'));
    });
  });

  // Handle Match Start/Exit
  const startMatchBtn = document.getElementById('start-match-btn');
  if (startMatchBtn) {
    startMatchBtn.addEventListener('click', () => matchEngine.start());
  }

  const exitMatchBtn = document.querySelector('.exit-match');
  if (exitMatchBtn) {
    exitMatchBtn.addEventListener('click', () => matchEngine.stop());
  }

  // Handle Window Resize
  window.addEventListener('resize', () => {
    if (matchEngine.isRunning) matchEngine.resize();
  });
});
