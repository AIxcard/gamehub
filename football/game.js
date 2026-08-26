/* =========================================================
   FOOTBALL LEGENDS - GAME ENGINE & NAVIGATION CONTROLLER
   ========================================================= */

// --- STATE MANAGEMENT ---
const state = {
  coins: 1000,
  squad: [
    { id: 'p1', name: 'Haaland', pos: 'ST', rating: 91, x: 50, y: 20 },
    { id: 'p2', name: 'De Bruyne', pos: 'CM', rating: 91, x: 50, y: 50 },
    { id: 'p3', name: 'Van Dijk', pos: 'CB', rating: 89, x: 50, y: 75 },
    { id: 'p4', name: 'Alisson', pos: 'GK', rating: 89, x: 50, y: 90 }
  ],
  collection: [
    { id: 'p1', name: 'Haaland', pos: 'ST', rating: 91, club: 'Man City' },
    { id: 'p2', name: 'De Bruyne', pos: 'CM', rating: 91, club: 'Man City' },
    { id: 'p3', name: 'Van Dijk', pos: 'CB', rating: 89, club: 'Liverpool' },
    { id: 'p4', name: 'Alisson', pos: 'GK', rating: 89, club: 'Liverpool' }
  ]
};

// --- DOM ROUTING ENGINE ---
function navigateTo(pageId) {
  if (!pageId) return;
  
  // Hide all sections with class .page
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  // Update navbar button highlights
  const navButtons = document.querySelectorAll('.nav-links button');
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
  });

  // Activate target section
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// --- RENDER FUNCTIONS ---
function renderSquad() {
  const pitchContainer = document.querySelector('.pitch');
  if (!pitchContainer) return;

  pitchContainer.innerHTML = state.squad.map(player => `
    <div class="formation-player" style="left: ${player.x}%; top: ${player.y}%;">
      <div class="formation-player-dot">${player.rating}</div>
      <span class="formation-player-name">${player.name}</span>
    </div>
  `).join('');
}

// --- MATCH CANVAS ENGINE ---
class MatchEngine {
  constructor() {
    this.canvas = document.getElementById('match-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.keys = {};

    this.player = { x: 200, y: 300, speed: 4, radius: 12 };
    this.ball = { x: 400, y: 300, vx: 0, vy: 0, radius: 8 };

    window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);
  }

  start() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.isRunning = true;
    
    const matchScreen = document.querySelector('.match-screen');
    if (matchScreen) matchScreen.classList.add('active');

    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
    const matchScreen = document.querySelector('.match-screen');
    if (matchScreen) matchScreen.classList.remove('active');
  }

  update() {
    if (this.keys['w'] || this.keys['arrowup']) this.player.y -= this.player.speed;
    if (this.keys['s'] || this.keys['arrowdown']) this.player.y += this.player.speed;
    if (this.keys['a'] || this.keys['arrowleft']) this.player.x -= this.player.speed;
    if (this.keys['d'] || this.keys['arrowright']) this.player.x += this.player.speed;

    // Ball movement
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
    this.ball.vx *= 0.98;
    this.ball.vy *= 0.98;

    // Ball-player collision
    const dist = Math.hypot(this.player.x - this.ball.x, this.player.y - this.ball.y);
    if (dist < this.player.radius + this.ball.radius) {
      this.ball.vx = (this.ball.x - this.player.x) * 0.2;
      this.ball.vy = (this.ball.y - this.player.y) * 0.2;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

// --- BIND ALL CLICK EVENTS ---
document.addEventListener('DOMContentLoaded', () => {
  renderSquad();

  // Dynamic Event Delegation for Navigation
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) {
      const pageId = target.getAttribute('data-page');
      
      if (pageId === 'play') {
        matchEngine.start();
      } else {
        matchEngine.stop();
        navigateTo(pageId);
      }
    }
  });
});
