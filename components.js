/* ============================================================
   components.js — Shared nav + footer injected on every page
   ============================================================ */

(function () {
  /* ── Active page detection ── */
  const page = location.pathname.split('/').pop() || 'index.html';

  const navHTML = `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <span class="logo-main">Parklands SS</span>
        <span class="logo-sub">Secondary School · Zambia</span>
      </a>

      <ul class="nav-links" id="navLinks">
        <li><a href="index.html" class="${page==='index.html'?'active':''}">Home</a></li>
        <li class="has-dropdown">
          <a href="about.html" class="${page==='about.html'?'active':''}">About</a>
          <div class="dropdown">
            <a href="about.html#vision">Vision & Mission</a>
            <a href="about.html#staff">Our Staff</a>
            <a href="about.html#why">Why Choose Us</a>
          </div>
        </li>
        <li class="has-dropdown">
          <a href="academics.html" class="${page==='academics.html'?'active':''}">Academics</a>
          <div class="dropdown">
            <a href="academics.html#programmes">Programmes</a>
            <a href="academics.html#curriculum">Curriculum</a>
            <a href="academics.html#results">Results</a>
          </div>
        </li>
        <li><a href="admissions.html" class="${page==='admissions.html'?'active':''}">Admissions</a></li>
        <li><a href="news.html" class="${page==='news.html'?'active':''}">News</a></li>
        <li><a href="contact.html" class="${page==='contact.html'?'active':''}">Contact</a></li>
      </ul>

      <a href="admissions.html" class="btn btn-primary nav-cta">Apply Now</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Nav -->
  <div class="mobile-nav" id="mobileNav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="academics.html">Academics</a>
    <a href="admissions.html">Admissions</a>
    <a href="news.html">News</a>
    <a href="contact.html">Contact</a>
    <a href="admissions.html" class="btn btn-primary mobile-cta">Apply Now →</a>
  </div>`;

  const footerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-logo">
            <span class="logo-main" style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:#fff;font-weight:700;">Parklands SS</span>
            <span class="logo-sub" style="font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#C9A84C;margin-top:4px;display:block;">Secondary School · Zambia</span>
          </div>
          <p>Shaping future leaders through quality education, moral discipline, and a culture of excellence since our founding.</p>
          <p style="margin-top:10px;font-style:italic;color:rgba(255,255,255,0.4);font-size:0.85rem;">"Narrow path is the way."</p>
          <div class="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="academics.html">Academics</a></li>
            <li><a href="admissions.html">Admissions</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4>Academics</h4>
          <ul class="footer-links">
            <li><a href="academics.html#programmes">Science & Technology</a></li>
            <li><a href="academics.html#programmes">Humanities</a></li>
            <li><a href="academics.html#programmes">Commerce</a></li>
            <li><a href="academics.html#results">Exam Results</a></li>
            <li><a href="admissions.html">Enrol Now</a></li>
          </ul>
        </div>

        <div>
          <h4>Contact Us</h4>
          <ul class="footer-contact">
            <li><span>📍</span> Parklands, Lusaka, Zambia</li>
            <li><span>📞</span> +260 211 000 000</li>
            <li><span>✉️</span> info@parklandsss.edu.zm</li>
            <li><span>🕗</span> Mon–Fri: 07:30 – 17:00</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>© 2026 Parklands Secondary School · All rights reserved · <a href="#">Privacy Policy</a></p>
      </div>
    </div>
  </footer>`;

  /* Inject nav before body content */
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* Inject footer at end of body */
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ── Scroll: navbar shadow ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Hamburger toggle ── */
  const ham = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats-section').forEach(el => counterObs.observe(el));
})();
