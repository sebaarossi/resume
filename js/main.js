/* ===================================
   CUSTOM CURSOR
=================================== */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = 'a, button, .proj-card, .tl-card, .edu-card, .pill, .skill-block';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorRing.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorRing.classList.remove('hover');
    });
  });
}

/* ===================================
   NAVBAR — scroll & active link
=================================== */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}, { passive: true });

/* ===================================
   MOBILE MENU
=================================== */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open');
});

navLinks.forEach(l => l.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('open');
}));

/* ===================================
   DARK / LIGHT THEME TOGGLE
=================================== */
const themeBtn = document.getElementById('themeBtn');
const html     = document.documentElement;
const icon     = themeBtn.querySelector('i');

// Only apply saved theme if user explicitly set it on this site
const saved = localStorage.getItem('sr-theme');
if (saved === 'light' || saved === 'dark') {
  html.setAttribute('data-theme', saved);
}
const current = html.getAttribute('data-theme') || 'dark';
icon.className = current === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sr-theme', next);
  icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
});

/* ===================================
   SCROLL REVEAL — IntersectionObserver
   (runs first so it works even if CDNs fail)
=================================== */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Hard fallback: show everything after 2s in case observer never fires
setTimeout(() => {
  revealEls.forEach(el => el.classList.add('visible'));
}, 2000);

/* ===================================
   TYPED.JS
=================================== */
if (typeof Typed !== 'undefined') {
  new Typed('#typed-text', {
    strings: [
      'Backend Software Developer',
      'Systems Engineering Student',
      'Problem Solver',
      'Tech Enthusiast',
    ],
    typeSpeed:  55,
    backSpeed:  30,
    backDelay:  1800,
    loop:       true,
    showCursor: false,
  });
} else {
  // Fallback static text if CDN failed
  document.getElementById('typed-text').textContent = 'Backend Software Developer';
}

/* ===================================
   PARTICLE CANVAS
=================================== */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const ACCENT = '20, 184, 166';
const COUNT  = 55;

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x      = Math.random() * canvas.width;
    this.y      = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
    this.r      = Math.random() * 1.4 + 0.4;
    this.vx     = (Math.random() - 0.5) * 0.45;
    this.vy     = (Math.random() - 0.5) * 0.45;
    this.alpha  = Math.random() * 0.35 + 0.08;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10 || this.x > canvas.width + 10 ||
        this.y < -10 || this.y > canvas.height + 10) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ACCENT}, ${this.alpha})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: COUNT }, () => new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 115) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - dist / 115) * 0.1})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
})();

/* ===================================
   DINO GAME EASTER EGG
=================================== */
(function () {
  const gameBtn     = document.getElementById('gameBtn');
  const gameModal   = document.getElementById('gameModal');
  const gameClose   = document.getElementById('gameClose');
  const dinoCanvas  = document.getElementById('dinoCanvas');
  const gameOverMsg = document.getElementById('gameOverMsg');
  const dc          = dinoCanvas.getContext('2d');

  const GW = 400, GH = 150;
  const GROUND   = GH - 28;
  const GRAVITY  = 0.62;
  const JUMP_V   = -13;
  const DW = 34, DH = 42;
  const ACCENT   = '#14b8a6';
  const OBSTACLE = '#94a3b8';

  let rafId, gameActive = false, gameStarted = false;
  let score, bonusScore, hiScore = 0, spd, frame, dino, obstacles, nextObs;
  let coins, nextCoin, popups;

  function init() {
    bonusScore = 0;
    spd        = 4.5;
    frame      = 0;
    dino       = { x: 60, y: GROUND - DH, vy: 0, grounded: true };
    obstacles  = [];
    nextObs    = 110;
    coins      = [];
    nextCoin   = 90 + Math.random() * 60;
    popups     = [];
    gameActive  = true;
    gameStarted = true;
    gameOverMsg.textContent = '';
  }

  function drawDino() {
    const { x, y } = dino;
    dc.fillStyle = ACCENT;
    dc.fillRect(x + 6, y,       DW - 6, DH - 8);   // body
    dc.fillRect(x + 14, y - 11, 16,     12);         // head
    dc.fillStyle = '#060b14';
    dc.fillRect(x + 24, y - 9,  4, 4);               // eye
    dc.fillStyle = ACCENT;
    dc.fillRect(x,      y + 6,  8, 5);               // tail-1
    dc.fillRect(x - 3,  y + 9,  6, 4);               // tail-2
    // legs
    const leg = dino.grounded ? Math.floor(frame / 6) % 2 : 0;
    dc.fillRect(x + 8,  y + DH - 12,           8, 12 - (leg ? 5 : 0));
    dc.fillRect(x + 20, y + DH - 12 + (leg ? 5 : 0), 8, 12 - (leg ? 5 : 0));
  }

  function drawCactus(o) {
    const base = GROUND;
    dc.fillStyle = OBSTACLE;
    dc.fillRect(o.x + o.w / 2 - 4, base - o.h, 8, o.h);  // stem
    if (o.h > 38) {
      const armY = base - o.h * 0.55;
      dc.fillRect(o.x,          armY - 14, 8,     14); // left arm
      dc.fillRect(o.x,          armY,      o.w,   7);  // crossbar
      dc.fillRect(o.x + o.w - 8, armY - 10, 8,   10); // right arm
    }
  }

  function hit(o) {
    const m = 5;
    return (
      dino.x + m         < o.x + o.w - m &&
      dino.x + DW - m    > o.x + m &&
      dino.y + DH - m    > GROUND - o.h
    );
  }

  function drawCoin(c) {
    // Outer ring
    dc.beginPath();
    dc.arc(c.x, c.y, 8, 0, Math.PI * 2);
    dc.fillStyle = '#fbbf24';
    dc.fill();
    // Inner shine
    dc.beginPath();
    dc.arc(c.x - 2, c.y - 2, 4, 0, Math.PI * 2);
    dc.fillStyle = '#fde68a';
    dc.fill();
    // "$" symbol
    dc.fillStyle = '#92400e';
    dc.font = 'bold 9px monospace';
    dc.textAlign = 'center';
    dc.textBaseline = 'middle';
    dc.fillText('$', c.x, c.y + 1);
    dc.textBaseline = 'alphabetic';
    dc.textAlign = 'left';
  }

  function loop() {
    dc.clearRect(0, 0, GW, GH);
    frame++;
    score = Math.floor(frame / 7) + bonusScore;
    // Speed ramps up every 300 frames
    if (frame % 300 === 0) spd = Math.min(spd + 0.5, 15);

    // Ground line
    dc.fillStyle = 'rgba(20,184,166,0.35)';
    dc.fillRect(0, GROUND, GW, 2);

    // Dino physics
    dino.vy += GRAVITY;
    dino.y  += dino.vy;
    if (dino.y >= GROUND - DH) {
      dino.y  = GROUND - DH;
      dino.vy = 0;
      dino.grounded = true;
    }
    drawDino();

    // Obstacles — gap shrinks as speed grows
    nextObs--;
    if (nextObs <= 0) {
      const h = 32 + Math.random() * 28;
      const w = 18 + Math.random() * 14;
      obstacles.push({ x: GW + 10, w, h });
      const minGap = Math.max(38, 75 - (spd - 4.5) * 6);
      const rndGap = Math.max(28, 85 - (spd - 4.5) * 7);
      nextObs = minGap + Math.random() * rndGap;
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= spd;
      drawCactus(obstacles[i]);
      if (hit(obstacles[i])) { endGame(); return; }
      if (obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i, 1);
    }

    // Coins
    nextCoin--;
    if (nextCoin <= 0) {
      const count   = 1 + Math.floor(Math.random() * 3); // 1, 2 or 3
      const airCoin = Math.random() < 0.5;
      const coinY   = airCoin
        ? GROUND - DH - 18 - Math.random() * 22
        : GROUND - 10;
      for (let k = 0; k < count; k++) {
        coins.push({ x: GW + 20 + k * 22, y: coinY });
      }
      nextCoin = 80 + Math.random() * 90;
    }
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.x -= spd;
      drawCoin(c);
      // Collect?
      const cx = dino.x + DW / 2, cy = dino.y + DH / 2;
      if (Math.hypot(cx - c.x, cy - c.y) < 20) {
        bonusScore += 10;
        popups.push({ x: c.x, y: c.y, text: '+10', life: 40 });
        coins.splice(i, 1);
        continue;
      }
      if (c.x < -10) coins.splice(i, 1);
    }

    // Popups (+10)
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.y   -= 1;
      p.life--;
      dc.globalAlpha = p.life / 40;
      dc.fillStyle   = '#fbbf24';
      dc.font        = 'bold 11px "Space Grotesk", monospace';
      dc.textAlign   = 'center';
      dc.fillText(p.text, p.x, p.y);
      dc.textAlign   = 'left';
      dc.globalAlpha = 1;
      if (p.life <= 0) popups.splice(i, 1);
    }

    // HUD
    dc.font = '13px "Space Grotesk", monospace';
    dc.textAlign = 'right';
    dc.fillStyle = 'rgba(100,116,139,0.8)';
    dc.fillText(`HI ${String(hiScore).padStart(5,'0')}`, GW - 10, 20);
    dc.fillStyle = '#e2e8f0';
    dc.fillText(String(score).padStart(5, '0'), GW - 90, 20);
    dc.textAlign = 'left';

    rafId = requestAnimationFrame(loop);
  }

  function jump() {
    if (!gameStarted || !gameActive) { init(); loop(); return; }
    if (dino.grounded) {
      dino.vy      = JUMP_V;
      dino.grounded = false;
    }
  }

  function endGame() {
    gameActive = false;
    cancelAnimationFrame(rafId);
    hiScore = Math.max(hiScore, score);
    gameOverMsg.textContent = `GAME OVER · ${score} pts — Space/Tap to restart`;
  }

  function drawIdle() {
    dc.clearRect(0, 0, GW, GH);
    dc.fillStyle = 'rgba(20,184,166,0.35)';
    dc.fillRect(0, GROUND, GW, 2);
    dino = { x: 60, y: GROUND - DH, vy: 0, grounded: true };
    frame = 0;
    drawDino();
    dc.fillStyle = 'rgba(20,184,166,0.65)';
    dc.font = '15px "Space Grotesk", sans-serif';
    dc.textAlign = 'center';
    dc.fillText('Press Space or tap to start', GW / 2, GH / 2 + 8);
    dc.textAlign = 'left';
  }

  function openGame() {
    gameModal.classList.add('open');
    gameStarted = false;
    gameActive  = false;
    cancelAnimationFrame(rafId);
    gameOverMsg.textContent = '';
    drawIdle();
  }

  function closeGame() {
    gameModal.classList.remove('open');
    gameActive = false;
    cancelAnimationFrame(rafId);
  }

  gameBtn.addEventListener('click', openGame);
  gameClose.addEventListener('click', closeGame);
  gameModal.addEventListener('click', e => { if (e.target === gameModal) closeGame(); });
  dinoCanvas.addEventListener('click', jump);
  dinoCanvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); }, { passive: false });

  document.addEventListener('keydown', e => {
    if (!gameModal.classList.contains('open')) return;
    if (e.code === 'Space') { e.preventDefault(); jump(); }
    if (e.code === 'Escape') closeGame();
  });
}());

