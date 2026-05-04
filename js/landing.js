// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  // Show/hide nav links based on scroll
  if (scrolled) {
    navLinks.classList.remove('nav-hidden');
    navLinks.classList.add('nav-visible');
  } else {
    navLinks.classList.add('nav-hidden');
    navLinks.classList.remove('nav-visible');
  }
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Εστάλη!';
    btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3000);
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ===== 3D WARP SPEED LINES =====
(function() {
  const c = document.getElementById('warpCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, cx, cy;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; cx = W/2; cy = H/2; }
  resize(); window.addEventListener('resize', resize);

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.angle = Math.random() * Math.PI * 2;
      this.dist = Math.random() * 5;
      this.speed = 0.3 + Math.random() * 1.2;
      this.length = 20 + Math.random() * 80;
      this.maxDist = Math.max(W, H) * 0.9;
      this.opacity = 0;
      this.thickness = 0.3 + Math.random() * 1.2;
    }
    update() {
      this.dist += this.speed * (1 + this.dist * 0.008);
      const p = this.dist / this.maxDist;
      this.opacity = p < 0.1 ? p / 0.1 : Math.min(1, 0.15 + p * 0.6);
      if (this.dist > this.maxDist) this.reset();
    }
    draw() {
      const cos = Math.cos(this.angle), sin = Math.sin(this.angle);
      const td = Math.max(0, this.dist - this.length * (0.5 + this.dist * 0.003));
      const x1 = cx + cos * td, y1 = cy + sin * td;
      const x2 = cx + cos * this.dist, y2 = cy + sin * this.dist;
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, `rgba(59,139,235,0)`);
      g.addColorStop(0.5, `rgba(59,139,235,${this.opacity * 0.3})`);
      g.addColorStop(1, `rgba(105,180,255,${this.opacity * 0.5})`);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = g; ctx.lineWidth = this.thickness; ctx.stroke();
    }
  }

  const stars = Array.from({length: 200}, () => { const s = new Star(); s.dist = Math.random() * Math.max(W,H) * 0.8; return s; });
  function animate() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== FLOATING PARTICLES =====
(function() {
  const c = document.getElementById('particlesCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  class P {
    constructor() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = 1.5 + Math.random() * 4;
      this.vx = -0.2 + Math.random() * 0.4; this.vy = -0.15 + Math.random() * 0.3;
      this.op = 0.1 + Math.random() * 0.4;
      this.ps = 0.005 + Math.random() * 0.015;
      this.po = Math.random() * Math.PI * 2;
      this.cop = 0;
    }
    update(t) {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10) this.x = W + 10; if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10; if (this.y > H + 10) this.y = -10;
      this.cop = this.op * (0.5 + 0.5 * Math.sin(t * this.ps + this.po));
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      g.addColorStop(0, `rgba(59,139,235,${this.cop})`);
      g.addColorStop(0.4, `rgba(59,139,235,${this.cop * 0.4})`);
      g.addColorStop(1, `rgba(59,139,235,0)`);
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
  }

  const ps = Array.from({length: 45}, () => new P());
  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H); t++;
    ps.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();
