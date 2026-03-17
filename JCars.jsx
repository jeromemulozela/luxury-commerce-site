import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

// ── STYLES ────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --noir: #0a0a0a;
    --charcoal: #111111;
    --surface: #161616;
    --surface2: #1e1e1e;
    --border: rgba(201,168,76,0.18);
    --gold: #C9A84C;
    --gold-light: #e8c96a;
    --gold-dim: rgba(201,168,76,0.45);
    --ivory: #F5F0E8;
    --ivory-dim: rgba(245,240,232,0.65);
    --ivory-faint: rgba(245,240,232,0.12);
    --red: #c0392b;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Outfit', sans-serif;
    --transition: cubic-bezier(0.4,0,0.2,1);
    --shadow-gold: 0 0 40px rgba(201,168,76,0.12);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--noir);
    color: var(--ivory);
    font-family: var(--font-body);
    font-weight: 300;
    letter-spacing: 0.01em;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--charcoal); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 99px; }

  .serif { font-family: var(--font-display); }

  /* NAVBAR */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5vw;
    height: 72px;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    transition: all 0.4s var(--transition);
  }
  .navbar.scrolled {
    height: 60px;
    background: rgba(10,10,10,0.98);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--ivory);
    cursor: pointer;
    user-select: none;
  }
  .nav-logo span { color: var(--gold); }
  .nav-links {
    display: flex; gap: 2.4rem; list-style: none;
  }
  .nav-links li a {
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ivory-dim);
    text-decoration: none;
    position: relative;
    transition: color 0.3s;
    padding-bottom: 4px;
  }
  .nav-links li a::after {
    content: '';
    position: absolute; bottom: 0; left: 0;
    width: 0; height: 1px;
    background: var(--gold);
    transition: width 0.35s var(--transition);
  }
  .nav-links li a:hover { color: var(--ivory); }
  .nav-links li a:hover::after { width: 100%; }
  .nav-right { display: flex; align-items: center; gap: 1.2rem; }
  .cart-btn {
    position: relative;
    background: none; border: 1px solid var(--border);
    color: var(--ivory-dim);
    width: 42px; height: 42px;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s;
    font-size: 1.1rem;
  }
  .cart-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--ivory-faint); }
  .cart-badge {
    position: absolute; top: -5px; right: -5px;
    background: var(--gold); color: var(--noir);
    font-size: 0.6rem; font-weight: 600;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: popIn 0.3s var(--transition);
  }
  @keyframes popIn {
    from { transform: scale(0); } to { transform: scale(1); }
  }
  .hamburger {
    display: none;
    flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 4px;
  }
  .hamburger span {
    display: block; width: 22px; height: 1.5px;
    background: var(--ivory); transition: all 0.3s;
  }

  /* HERO */
  .hero {
    position: relative;
    height: 100svh; min-height: 640px;
    display: flex; align-items: center;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.07) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0c0a 100%);
  }
  .hero-img {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: 58%;
    object-fit: cover;
    opacity: 0.35;
    mask-image: linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
  }
  .hero-grain {
    position: absolute; inset: 0; opacity: 0.035; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 128px 128px;
  }
  .hero-content {
    position: relative; z-index: 2;
    padding: 0 5vw; max-width: 680px;
    animation: heroFadeUp 1.1s var(--transition) both;
  }
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hero-eyebrow {
    font-size: 0.68rem; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 500; margin-bottom: 1.4rem;
    display: flex; align-items: center; gap: 0.8rem;
  }
  .hero-eyebrow::before {
    content: ''; display: block; width: 32px; height: 1px; background: var(--gold);
  }
  .hero-headline {
    font-family: var(--font-display);
    font-size: clamp(3.2rem, 7vw, 6rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: var(--ivory);
    margin-bottom: 1.4rem;
  }
  .hero-headline em { font-style: italic; color: var(--gold); }
  .hero-sub {
    font-size: 0.92rem; font-weight: 300; line-height: 1.75;
    color: var(--ivory-dim); max-width: 420px; margin-bottom: 2.8rem;
  }
  .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: var(--gold); color: var(--noir);
    padding: 0.85rem 2.2rem;
    font-family: var(--font-body); font-size: 0.72rem;
    font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
    border: none; cursor: pointer;
    transition: all 0.3s var(--transition);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .btn-primary:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(201,168,76,0.35);
  }
  .btn-primary:active { transform: translateY(0); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: transparent; color: var(--ivory-dim);
    padding: 0.85rem 2rem;
    font-family: var(--font-body); font-size: 0.72rem;
    font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid var(--border); cursor: pointer;
    transition: all 0.3s var(--transition);
  }
  .btn-ghost:hover { border-color: var(--gold-dim); color: var(--ivory); }
  .hero-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 5vw;
    display: flex; align-items: center; gap: 0.7rem;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ivory-faint); animation: heroFadeUp 1.4s 0.5s var(--transition) both;
  }
  .hero-scroll-line {
    width: 40px; height: 1px; background: var(--ivory-faint);
    position: relative; overflow: hidden;
  }
  .hero-scroll-line::after {
    content: ''; position: absolute; left: -100%; top: 0;
    width: 100%; height: 100%; background: var(--gold);
    animation: scrollLine 2s 1s ease-in-out infinite;
  }
  @keyframes scrollLine {
    0% { left: -100%; } 100% { left: 100%; }
  }

  /* SECTION COMMON */
  .section { padding: 7rem 5vw; }
  .section-label {
    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--gold); font-weight: 500;
    display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem;
  }
  .section-label::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300; line-height: 1.15;
    color: var(--ivory); margin-bottom: 0.5rem;
  }
  .section-title em { font-style: italic; color: var(--gold); }
  .section-sub {
    font-size: 0.88rem; color: var(--ivory-dim); line-height: 1.7;
    max-width: 500px;
  }
  .section-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 2rem; flex-wrap: wrap; margin-bottom: 4rem;
  }

  /* FILTER BAR */
  .filter-bar {
    display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;
  }
  .filter-btn {
    background: none; border: 1px solid var(--border);
    color: var(--ivory-dim);
    padding: 0.4rem 1.1rem;
    font-family: var(--font-body); font-size: 0.68rem;
    font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s;
  }
  .filter-btn:hover, .filter-btn.active {
    background: var(--gold); color: var(--noir); border-color: var(--gold);
  }
  .sort-select {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--ivory-dim);
    padding: 0.4rem 1rem;
    font-family: var(--font-body); font-size: 0.68rem;
    font-weight: 400; letter-spacing: 0.08em;
    cursor: pointer; outline: none;
  }
  .sort-select option { background: var(--surface); }

  /* PRODUCT GRID */
  .products-section { background: var(--charcoal); }
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2px;
  }
  .product-card {
    background: var(--surface);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.4s var(--transition);
    border: 1px solid transparent;
  }
  .product-card:hover {
    transform: translateY(-6px);
    border-color: var(--border);
    box-shadow: var(--shadow-gold);
    z-index: 2;
  }
  .product-img-wrap {
    position: relative; overflow: hidden;
    aspect-ratio: 4/3;
    background: var(--surface2);
  }
  .product-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s var(--transition), filter 0.4s;
    filter: grayscale(20%) brightness(0.9);
  }
  .product-card:hover .product-img {
    transform: scale(1.06);
    filter: grayscale(0%) brightness(1);
  }
  .product-badge {
    position: absolute; top: 1rem; left: 1rem;
    background: var(--gold); color: var(--noir);
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; padding: 0.25rem 0.65rem;
  }
  .wishlist-btn {
    position: absolute; top: 0.9rem; right: 0.9rem;
    background: rgba(10,10,10,0.6); backdrop-filter: blur(8px);
    border: 1px solid var(--border); color: var(--ivory-dim);
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 0.9rem;
    transition: all 0.3s;
    z-index: 3;
  }
  .wishlist-btn:hover, .wishlist-btn.active {
    background: rgba(192,57,43,0.8); border-color: #c0392b; color: #fff;
  }
  .product-body { padding: 1.4rem 1.5rem 1.6rem; }
  .product-category {
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 0.5rem;
  }
  .product-name {
    font-family: var(--font-display);
    font-size: 1.25rem; font-weight: 500;
    color: var(--ivory); margin-bottom: 0.4rem;
    line-height: 1.2;
  }
  .product-desc {
    font-size: 0.78rem; color: var(--ivory-dim); line-height: 1.6;
    margin-bottom: 1.1rem;
  }
  .product-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .product-price {
    font-family: var(--font-display);
    font-size: 1.4rem; font-weight: 600; color: var(--gold);
  }
  .add-to-cart-btn {
    background: transparent; border: 1px solid var(--border);
    color: var(--ivory-dim);
    padding: 0.5rem 1.1rem;
    font-family: var(--font-body); font-size: 0.65rem;
    font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s var(--transition);
    display: flex; align-items: center; gap: 0.4rem;
  }
  .add-to-cart-btn:hover {
    background: var(--gold); border-color: var(--gold); color: var(--noir);
    transform: scale(1.04);
  }
  .add-to-cart-btn:active { transform: scale(0.97); }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(5,5,5,0.88);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.3s var(--transition);
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    max-width: 860px; width: 100%;
    max-height: 90svh;
    overflow-y: auto;
    display: grid; grid-template-columns: 1fr 1fr;
    animation: modalUp 0.4s var(--transition);
    position: relative;
  }
  @keyframes modalUp {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-img-wrap {
    position: relative; overflow: hidden;
    background: var(--surface2);
  }
  .modal-img { width: 100%; height: 100%; object-fit: cover; min-height: 420px; }
  .modal-body { padding: 2.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
  .modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--ivory-dim); width: 36px; height: 36px;
    border-radius: 50%; cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.25s; z-index: 10;
  }
  .modal-close:hover { background: var(--red); border-color: var(--red); color: #fff; }
  .modal-category {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold);
  }
  .modal-name {
    font-family: var(--font-display); font-size: 2rem; font-weight: 400;
    line-height: 1.1; color: var(--ivory);
  }
  .modal-price {
    font-family: var(--font-display); font-size: 1.8rem; font-weight: 600; color: var(--gold);
  }
  .modal-desc { font-size: 0.84rem; color: var(--ivory-dim); line-height: 1.75; }
  .modal-label {
    font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--ivory-dim); margin-bottom: 0.5rem;
  }
  .variant-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .variant-btn {
    padding: 0.35rem 0.9rem; border: 1px solid var(--border);
    background: none; color: var(--ivory-dim);
    font-family: var(--font-body); font-size: 0.74rem; cursor: pointer;
    transition: all 0.2s;
  }
  .variant-btn:hover, .variant-btn.active {
    border-color: var(--gold); color: var(--gold);
  }
  .qty-control {
    display: flex; align-items: center; gap: 0;
    border: 1px solid var(--border); width: fit-content;
  }
  .qty-btn {
    background: none; border: none; color: var(--ivory-dim);
    width: 36px; height: 36px; cursor: pointer; font-size: 1rem;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center;
  }
  .qty-btn:hover { background: var(--ivory-faint); color: var(--gold); }
  .qty-num {
    width: 44px; text-align: center;
    font-size: 0.88rem; font-weight: 500; color: var(--ivory);
    border-left: 1px solid var(--border); border-right: 1px solid var(--border);
    height: 36px; display: flex; align-items: center; justify-content: center;
    user-select: none;
  }
  .modal-add-btn {
    margin-top: auto;
    background: var(--gold); color: var(--noir);
    border: none; padding: 1rem;
    font-family: var(--font-body); font-size: 0.72rem;
    font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s var(--transition);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .modal-add-btn:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,168,76,0.3); }
  .modal-add-btn:active { transform: translateY(0); }

  /* CART DRAWER */
  .drawer-overlay {
    position: fixed; inset: 0; z-index: 1500;
    background: rgba(5,5,5,0.65); backdrop-filter: blur(6px);
    transition: opacity 0.3s;
  }
  .cart-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 1600;
    width: min(420px, 95vw);
    background: var(--surface);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.45s var(--transition);
    box-shadow: -20px 0 60px rgba(0,0,0,0.5);
  }
  .cart-drawer.open { transform: translateX(0); }
  .drawer-head {
    padding: 1.4rem 1.8rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .drawer-title {
    font-family: var(--font-display); font-size: 1.4rem; font-weight: 500;
  }
  .drawer-close {
    background: none; border: 1px solid var(--border); color: var(--ivory-dim);
    width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
    transition: all 0.2s;
  }
  .drawer-close:hover { border-color: var(--red); color: var(--red); }
  .drawer-items {
    flex: 1; overflow-y: auto; padding: 1.2rem 1.8rem;
    display: flex; flex-direction: column; gap: 1rem;
  }
  .cart-item {
    display: grid; grid-template-columns: 72px 1fr auto;
    gap: 1rem; align-items: center;
    padding: 0.9rem; border: 1px solid var(--border);
    animation: fadeIn 0.3s;
  }
  .cart-item-img { width: 72px; height: 60px; object-fit: cover; filter: brightness(0.85); }
  .cart-item-name {
    font-family: var(--font-display); font-size: 1rem; font-weight: 500; color: var(--ivory);
  }
  .cart-item-variant {
    font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); margin: 0.2rem 0;
  }
  .cart-item-price {
    font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; color: var(--gold);
  }
  .cart-item-controls {
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;
  }
  .remove-btn {
    background: none; border: none; color: rgba(192,57,43,0.7); cursor: pointer;
    font-size: 0.8rem; transition: color 0.2s;
  }
  .remove-btn:hover { color: var(--red); }
  .cart-empty {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1rem; color: var(--ivory-dim);
    padding: 2rem;
  }
  .cart-empty-icon { font-size: 3rem; opacity: 0.3; }
  .cart-empty-text { font-family: var(--font-display); font-size: 1.2rem; }
  .drawer-footer {
    padding: 1.5rem 1.8rem;
    border-top: 1px solid var(--border);
  }
  .subtotal-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.2rem;
  }
  .subtotal-label {
    font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ivory-dim);
  }
  .subtotal-val {
    font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; color: var(--gold);
  }
  .checkout-btn {
    width: 100%; padding: 1rem;
    background: var(--gold); border: none; color: var(--noir);
    font-family: var(--font-body); font-size: 0.72rem;
    font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s var(--transition);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .checkout-btn:hover { background: var(--gold-light); box-shadow: 0 8px 30px rgba(201,168,76,0.35); }

  /* TESTIMONIALS */
  .testimonials-section { background: var(--noir); position: relative; overflow: hidden; }
  .testimonials-section::before {
    content: '';
    position: absolute; left: -200px; top: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;
  }
  .testimonial-card {
    background: var(--surface); border: 1px solid var(--border);
    padding: 2rem; position: relative;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .testimonial-card:hover { border-color: var(--gold-dim); box-shadow: var(--shadow-gold); }
  .testimonial-card::before {
    content: '"';
    font-family: var(--font-display); font-size: 5rem; font-style: italic;
    color: var(--gold); opacity: 0.15;
    position: absolute; top: 0.5rem; right: 1.2rem;
    line-height: 1;
  }
  .stars { color: var(--gold); font-size: 0.75rem; margin-bottom: 1rem; letter-spacing: 0.1em; }
  .testimonial-text {
    font-size: 0.88rem; line-height: 1.75; color: var(--ivory-dim); margin-bottom: 1.5rem;
  }
  .testimonial-author { display: flex; align-items: center; gap: 0.9rem; }
  .author-avatar {
    width: 42px; height: 42px; border-radius: 50%; object-fit: cover;
    border: 1px solid var(--border); filter: grayscale(30%);
  }
  .author-name { font-family: var(--font-display); font-size: 1rem; font-weight: 500; }
  .author-role { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }

  /* NEWSLETTER */
  .newsletter-section {
    background:
      linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%),
      var(--surface2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    text-align: center;
    padding: 6rem 5vw;
  }
  .newsletter-title {
    font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 300; margin-bottom: 0.6rem;
  }
  .newsletter-sub { color: var(--ivory-dim); font-size: 0.88rem; margin-bottom: 2.5rem; }
  .newsletter-form {
    display: flex; gap: 0; max-width: 460px; margin: 0 auto;
  }
  .newsletter-input {
    flex: 1; background: var(--surface); border: 1px solid var(--border);
    border-right: none;
    color: var(--ivory); padding: 0.85rem 1.2rem;
    font-family: var(--font-body); font-size: 0.85rem; outline: none;
    transition: border-color 0.3s;
  }
  .newsletter-input::placeholder { color: rgba(245,240,232,0.3); }
  .newsletter-input:focus { border-color: var(--gold-dim); }
  .newsletter-submit {
    background: var(--gold); border: 1px solid var(--gold); color: var(--noir);
    padding: 0.85rem 1.6rem;
    font-family: var(--font-body); font-size: 0.68rem;
    font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s; white-space: nowrap;
  }
  .newsletter-submit:hover { background: var(--gold-light); border-color: var(--gold-light); }

  /* FOOTER */
  footer {
    background: var(--charcoal); border-top: 1px solid var(--border);
    padding: 4rem 5vw 2rem;
  }
  .footer-top {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem; margin-bottom: 3rem;
  }
  .footer-brand-name {
    font-family: var(--font-display); font-size: 1.8rem; font-weight: 600;
    letter-spacing: 0.1em; margin-bottom: 1rem;
  }
  .footer-brand-name span { color: var(--gold); }
  .footer-tagline { font-size: 0.82rem; color: var(--ivory-dim); line-height: 1.7; max-width: 260px; }
  .footer-socials { display: flex; gap: 0.7rem; margin-top: 1.5rem; }
  .social-link {
    width: 34px; height: 34px; border: 1px solid var(--border);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: var(--ivory-dim); font-size: 0.75rem; text-decoration: none;
    transition: all 0.25s;
  }
  .social-link:hover { border-color: var(--gold); color: var(--gold); }
  .footer-col-title {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 1.2rem;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .footer-links li a {
    color: var(--ivory-dim); text-decoration: none; font-size: 0.82rem;
    transition: color 0.2s;
  }
  .footer-links li a:hover { color: var(--ivory); }
  .footer-bottom {
    padding-top: 2rem; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
  }
  .footer-copy { font-size: 0.72rem; color: rgba(245,240,232,0.3); letter-spacing: 0.08em; }
  .footer-legal { display: flex; gap: 1.5rem; }
  .footer-legal a { font-size: 0.68rem; color: rgba(245,240,232,0.3); text-decoration: none; transition: color 0.2s; }
  .footer-legal a:hover { color: var(--ivory-dim); }

  /* TOAST */
  .toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: var(--surface); border: 1px solid var(--gold-dim);
    color: var(--ivory); padding: 0.8rem 1.6rem;
    font-size: 0.8rem; letter-spacing: 0.06em;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    z-index: 3000;
    animation: toastAnim 0.35s var(--transition);
    display: flex; align-items: center; gap: 0.6rem;
  }
  @keyframes toastAnim {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .toast-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }

  /* MOBILE MENU */
  .mobile-menu {
    display: none;
    position: fixed; inset: 0; z-index: 900;
    background: var(--charcoal);
    flex-direction: column; align-items: center; justify-content: center;
    gap: 2rem;
  }
  .mobile-menu.open { display: flex; animation: fadeIn 0.3s; }
  .mobile-menu a {
    font-family: var(--font-display); font-size: 2.2rem; font-weight: 300;
    color: var(--ivory); text-decoration: none; letter-spacing: 0.04em;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--gold); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .footer-top { grid-template-columns: 1fr 1fr; }
    .modal { grid-template-columns: 1fr; }
    .modal-img-wrap { display: none; }
  }
  @media (max-width: 600px) {
    .footer-top { grid-template-columns: 1fr; }
    .newsletter-form { flex-direction: column; }
    .newsletter-input { border-right: 1px solid var(--border); border-bottom: none; }
    .hero-ctas { flex-direction: column; align-items: flex-start; }
    .section-header { flex-direction: column; align-items: flex-start; }
    .product-grid { grid-template-columns: 1fr; }
  }
`;

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "Bugatti Chiron Super Sport",
    category: "Hypercar", price: 3_299_000,
    desc: "Quad-turbocharged 8.0L W16 engine producing 1,600 hp. A monument to engineering excess.",
    image: "https://picsum.photos/seed/chiron/800/600",
    badge: "Limited",
    variants: ["Noir Élégance", "French Racing Blue", "Deep Scarlet"],
  },
  {
    id: 2, name: "Mercedes-AMG SL 63",
    category: "Grand Tourer", price: 189_500,
    desc: "Biturbo V8 with 577 hp. Open-air luxury that transforms every road into a stage.",
    image: "https://picsum.photos/seed/amgsl/800/600",
    badge: null,
    variants: ["Obsidian Black", "Selenite Grey", "Rubellite Red"],
  },
  {
    id: 3, name: "Lamborghini Revuelto",
    category: "Supercar", price: 608_000,
    desc: "Hybrid V12 successor to the Aventador. 1,001 hp of Italian drama, electrified.",
    image: "https://picsum.photos/seed/revuelto/800/600",
    badge: "New",
    variants: ["Bianco Canopus", "Verde Citrea", "Nero Noctis"],
  },
  {
    id: 4, name: "Rolls-Royce Spectre",
    category: "Ultra-Luxury EV", price: 413_000,
    desc: "The first fully electric Rolls-Royce. 577 hp delivered in absolute silence.",
    image: "https://picsum.photos/seed/spectre/800/600",
    badge: "EV",
    variants: ["Andalucian White", "Black Diamond", "Bespoke Copper"],
  },
  {
    id: 5, name: "Ferrari SF90 Stradale",
    category: "Hypercar", price: 561_000,
    desc: "986 hp plug-in hybrid V8. The fastest road-going Ferrari ever conceived.",
    image: "https://picsum.photos/seed/sf90/800/600",
    badge: null,
    variants: ["Rosso Corsa", "Giallo Modena", "Blu Pozzi"],
  },
  {
    id: 6, name: "Bentley Continental GT Speed",
    category: "Grand Tourer", price: 276_500,
    desc: "6.0L W12 biturbo, 659 hp. Where absolute power meets uncompromised luxury.",
    image: "https://picsum.photos/seed/bentley/800/600",
    badge: null,
    variants: ["Beluga Black", "Glacier White", "Viridian"],
  },
  {
    id: 7, name: "Porsche 911 GT3 RS",
    category: "Track-Focused", price: 228_500,
    desc: "Naturally aspirated 4.0L flat-six, 525 hp. Aerodynamic downforce rivaling a racing car.",
    image: "https://picsum.photos/seed/gt3rs/800/600",
    badge: "Track",
    variants: ["Python Green", "Shark Blue", "GT Silver"],
  },
  {
    id: 8, name: "Aston Martin DBS 770",
    category: "Grand Tourer", price: 342_000,
    desc: "770 hp twin-turbo V12. The most powerful production Aston Martin ever built.",
    image: "https://picsum.photos/seed/dbs770/800/600",
    badge: "Final Edition",
    variants:["Magnetic Silver", "Zaffre Blue", "Onyx Black"],
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    text: "J Cars delivered my Bugatti Chiron in six weeks with a completely bespoke interior. The attention to detail is extraordinary — unlike any dealership experience I've had.",
    author: "Alexander Hartmann", role: "Private Equity, Geneva",
    avatar: "https://picsum.photos/seed/alex/100/100", stars: 5,
  },
  {
    id: 2,
    text: "Acquiring my Rolls-Royce Spectre through J Cars was seamless. Their concierge team coordinated shipping, registration, and customization without a single misstep.",
    author: "Isabelle Montfort", role: "Art Collector, Monaco",
    avatar: "https://picsum.photos/seed/isabelle/100/100", stars: 5,
  },
  {
    id: 3,
    text: "The knowledge their specialists bring to each acquisition is impressive. They sourced a spec of the SF90 I thought impossible to find. Truly elite service.",
    author: "Marcus Chen", role: "Tech Founder, Singapore",
    avatar: "https://picsum.photos/seed/marcus/100/100", stars: 5,
  },
];

// ── CONTEXT ───────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

function useCart() { return useContext(CartContext); }

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product, variant, qty = 1) => {
    setCart(prev => {
      const key = `${product.id}-${variant}`;
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, key, variant, qty }];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, delta) => {
    setCart(prev => prev.map(i => {
      if (i.key !== key) return i;
      const newQty = i.qty + delta;
      return newQty < 1 ? null : { ...i, qty: newQty };
    }).filter(Boolean));
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const Stars = ({ n }) => "★".repeat(n) + "☆".repeat(5 - n);

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast"><span className="toast-dot" />{msg}</div>;
}

function Navbar({ onShopClick }) {
  const { count, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">J<span>·</span>CARS</div>
        <ul className="nav-links">
          {["Home", "Shop", "About", "Contact"].map(l => (
            <li key={l}><a href="#" onClick={l === "Shop" ? (e) => { e.preventDefault(); onShopClick(); } : undefined}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
            🛒
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <button className="hamburger" aria-label="Menu" onClick={() => setMenuOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {["Home", "Shop", "About", "Contact"].map(l => (
          <a key={l} href="#" onClick={() => { setMenuOpen(false); if (l === "Shop") onShopClick(); }}>{l}</a>
        ))}
      </div>
    </>
  );
}

function Hero({ onShopClick }) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <img
        className="hero-img"
        src="https://picsum.photos/seed/hero-car/1400/900"
        alt="Luxury automobile"
      />
      <div className="hero-grain" />
      <div className="hero-content">
        <p className="hero-eyebrow">Curated Automotive Excellence</p>
        <h1 className="hero-headline">
          Drive the<br /><em>Extraordinary</em>
        </h1>
        <p className="hero-sub">
          J Cars presents the world's most coveted automobiles — each one sourced, verified, and delivered with unparalleled concierge service.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={onShopClick}>
            Shop the Collection →
          </button>
          <button className="btn-ghost">
            Private Showroom
          </button>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <div className="hero-scroll-line" />
        Scroll to explore
      </div>
    </section>
  );
}

function ProductCard({ product, onOpen, onAddToCart }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="product-card" onClick={() => onOpen(product)}>
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`wishlist-btn${wished ? " active" : ""}`}
          onClick={e => { e.stopPropagation(); setWished(v => !v); }}
          aria-label="Wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-footer">
          <span className="product-price">{fmt(product.price)}</span>
          <button
            className="add-to-cart-btn"
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            aria-label="Add to cart"
          >
            + Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSection({ shopRef }) {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [modalProduct, setModalProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const displayed = PRODUCTS
    .filter(p => activeFilter === "All" || p.category === activeFilter)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleAdd = (product, variant, qty) => {
    const v = variant || product.variants[0];
    addToCart(product, v, qty);
    setToast(`${product.name} added to cart`);
  };

  return (
    <section className="section products-section" id="shop" ref={shopRef}>
      <div className="section-header">
        <div>
          <p className="section-label">The Collection</p>
          <h2 className="section-title">Exceptional <em>Machines</em></h2>
          <p className="section-sub">Every vehicle is personally verified by our team and delivered anywhere in the world.</p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="filter-bar">
            {categories.map(c => (
              <button
                key={c}
                className={`filter-btn${activeFilter === c ? " active" : ""}`}
                onClick={() => setActiveFilter(c)}
              >{c}</button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {displayed.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onOpen={setModalProduct}
            onAddToCart={(prod) => handleAdd(prod)}
          />
        ))}
      </div>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAdd={handleAdd}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </section>
  );
}

function ProductModal({ product, onClose, onAdd }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-img-wrap">
          <img src={product.image} alt={product.name} className="modal-img" />
        </div>
        <div className="modal-body">
          <p className="modal-category">{product.category}</p>
          <h2 className="modal-name">{product.name}</h2>
          <p className="modal-price">{fmt(product.price)}</p>
          <p className="modal-desc">{product.desc} This vehicle is available for immediate acquisition with our full concierge delivery program.</p>

          <div>
            <p className="modal-label">Exterior Finish</p>
            <div className="variant-group">
              {product.variants.map(v => (
                <button
                  key={v}
                  className={`variant-btn${selectedVariant === v ? " active" : ""}`}
                  onClick={() => setSelectedVariant(v)}
                >{v}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="modal-label">Units</p>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <button
            className="modal-add-btn"
            onClick={() => { onAdd(product, selectedVariant, qty); onClose(); }}
          >
            Add to Enquiry Cart — {fmt(product.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, total } = useCart();

  return (
    <>
      {cartOpen && <div className="drawer-overlay" onClick={() => setCartOpen(false)} />}
      <aside className={`cart-drawer${cartOpen ? " open" : ""}`} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h2 className="drawer-title serif">Your Selection</h2>
          <button className="drawer-close" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🚗</div>
            <p className="cart-empty-text">Your garage is empty</p>
            <p style={{ fontSize: "0.78rem", color: "var(--ivory-dim)" }}>Add a vehicle to begin your acquisition</p>
          </div>
        ) : (
          <div className="drawer-items">
            {cart.map(item => (
              <div key={item.key} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-variant">{item.variant}</p>
                  <p className="cart-item-price">{fmt(item.price)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button className="qty-btn" style={{ width: 28, height: 28, fontSize: "0.8rem" }} onClick={() => updateQty(item.key, -1)}>−</button>
                    <span className="qty-num" style={{ width: 32, fontSize: "0.8rem" }}>{item.qty}</span>
                    <button className="qty-btn" style={{ width: 28, height: 28, fontSize: "0.8rem" }} onClick={() => updateQty(item.key, 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.key)}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">Total Enquiry Value</span>
              <span className="subtotal-val">{fmt(total)}</span>
            </div>
            <button className="checkout-btn">
              Request Acquisition →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials-section" id="about">
      <div className="section-header">
        <div>
          <p className="section-label">Client Voices</p>
          <h2 className="section-title">Trusted by the <em>Discerning</em></h2>
        </div>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="testimonial-card">
            <div className="stars"><Stars n={t.stars} /></div>
            <p className="testimonial-text">"{t.text}"</p>
            <div className="testimonial-author">
              <img src={t.avatar} alt={t.author} className="author-avatar" />
              <div>
                <p className="author-name">{t.author}</p>
                <p className="author-role">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    if (email.includes("@")) { setDone(true); setEmail(""); }
  };

  return (
    <section className="newsletter-section">
      <p className="section-label" style={{ justifyContent: "center" }}>Stay Informed</p>
      <h2 className="newsletter-title serif">
        Intelligence for the <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Passionate</em>
      </h2>
      <p className="newsletter-sub">
        Receive first access to new acquisitions, private sales, and J Cars editorial.
      </p>
      {done ? (
        <p style={{ color: "var(--gold)", letterSpacing: "0.1em", fontSize: "0.85rem" }}>
          ✓ &nbsp;You're on the list. Welcome to J Cars.
        </p>
      ) : (
        <div className="newsletter-form">
          <input
            className="newsletter-input"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
          <button className="newsletter-submit" onClick={submit}>Subscribe</button>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand-name">J<span>·</span>CARS</div>
          <p className="footer-tagline">
            The world's most coveted automobiles, curated and delivered with the precision they deserve.
          </p>
          <div className="footer-socials">
            {["𝕏", "in", "ig", "yt"].map(s => (
              <a key={s} href="#" className="social-link">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="footer-col-title">Inventory</p>
          <ul className="footer-links">
            {["Hypercars", "Grand Tourers", "Track Cars", "Electric", "Classic"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Services</p>
          <ul className="footer-links">
            {["Concierge Delivery", "Finance & Lease", "Private Showroom", "Trade-In", "Storage"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Company</p>
          <ul className="footer-links">
            {["About J Cars", "Careers", "Press", "Contact", "Legal"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">© 2025 J Cars Ltd. All rights reserved. Vehicles subject to prior sale.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Sale</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const shopRef = useRef(null);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CartProvider>
      <style>{GLOBAL_STYLES}</style>
      <Navbar onShopClick={scrollToShop} />
      <Hero onShopClick={scrollToShop} />
      <ProductSection shopRef={shopRef} />
      <Testimonials />
      <Newsletter />
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
