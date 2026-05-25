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

const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

themeBtn.addEventListener('click', () => {
  const isDark   = html.getAttribute('data-theme') === 'dark';
  const next     = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
});

/* ===================================
   TYPED.JS
=================================== */
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
   SCROLL REVEAL — IntersectionObserver
=================================== */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));
