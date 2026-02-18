import { useState, useEffect, useRef } from "react";


/* ─────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --black: #0a0a0a;
  --off-black: #111111;
  --charcoal: #1c1c1c;
  --dark-grey: #2a2a2a;
  --mid-grey: #555;
  --light-grey: #aaa;
  --off-white: #f5f5f0;
  --white: #ffffff;
  --gold: #e8c84a;
  --gold-dim: #c9a93b;
  --amber: #f59e0b;
  --blue-accent: #1E40AF;
  --red-accent: #e03e3e;
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'Barlow', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--black);
  color: var(--white);
  overflow-x: hidden;
}

/* ── NAVBAR ── */
.rk-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 4%;
  height: 64px;
  background: rgba(10,10,10,0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  transition: background 0.3s;
}
.rk-nav.scrolled { background: rgba(10,10,10,0.98); }

.rk-logo {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1.7rem;
  letter-spacing: 4px;
  color: var(--white);
  text-transform: uppercase;
  line-height: 1;
}
.rk-logo span { color: var(--gold); }

.rk-nav-links {
  display: flex; gap: 0.2rem; list-style: none; align-items: center;
}
.rk-nav-links a {
  font-family: var(--font-display);
  font-weight: 700; font-size: 1rem;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--light-grey);
  text-decoration: none; padding: 0.5rem 1.1rem;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}
.rk-nav-links a:hover { color: var(--white); background: rgba(255,255,255,0.06); }
.rk-nav-links a.active { color: var(--gold); }

.rk-nav-right { display: flex; align-items: center; gap: 1rem; }
.rk-nav-city {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-display);
  font-weight: 700; font-size: 0.9rem; letter-spacing: 1px;
  text-transform: uppercase; color: var(--light-grey);
  cursor: pointer; border: none; background: none;
}
.rk-nav-city:hover { color: var(--white); }

.rk-btn {
  font-family: var(--font-display);
  font-weight: 800; font-size: 0.95rem; letter-spacing: 2px;
  text-transform: uppercase; border: none; border-radius: 4px;
  cursor: pointer; transition: all 0.2s; padding: 0.6rem 1.5rem;
}
.rk-btn-gold {
  background: var(--gold); color: var(--black);
}
.rk-btn-gold:hover { background: var(--gold-dim); transform: translateY(-1px); }
.rk-btn-outline {
  background: transparent; color: var(--white);
  border: 1.5px solid rgba(255,255,255,0.3);
}
.rk-btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,0.07); }

/* ── HERO ── */
.rk-hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center;
  overflow: hidden;
  background: #060608;
}

/* discipline image — full hero, show image fully */
.rk-hero-bg-image {
  position: absolute; inset: 0; z-index: 0;
  background-image: url("/hero-discipline.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 100%;
  min-width: 100%;
}
/* lighter overlay so image shows more, text still readable */
.rk-hero-bg {
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(105deg, rgba(6,6,8,0.55) 0%, rgba(6,6,8,0.25) 40%, rgba(6,6,8,0.45) 100%),
    radial-gradient(ellipse 60% 70% at 70% 50%, rgba(0,0,0,0.2) 0%, transparent 55%);
}

/* subtle noise grain overlay */
.rk-hero-grain {
  position: absolute; inset: 0; z-index: 2; opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* faint grid */
.rk-hero-grid {
  position: absolute; inset: 0; opacity: 0.025; z-index: 2;
  background-image:
    linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* ── 3D IMAGE FRAME ── */
.rk-hero-3d-wrap {
  position: absolute;
  right: -2%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  perspective: 1000px;
  width: 52%;
  max-width: 720px;
}

/* shadow layers for depth */
.rk-hero-3d-shadow-far {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(0,0,0,0.7);
  transform: rotateY(-14deg) rotateX(4deg) translateZ(-60px) translateX(30px) translateY(18px);
  filter: blur(28px);
  transform-style: preserve-3d;
}
.rk-hero-3d-shadow-mid {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(232,200,74,0.15);
  transform: rotateY(-12deg) rotateX(3deg) translateZ(-30px) translateX(14px) translateY(10px);
  filter: blur(14px);
  transform-style: preserve-3d;
}

/* main image card */
.rk-hero-3d-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  transform: rotateY(-10deg) rotateX(2deg);
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
  box-shadow:
    -20px 30px 60px rgba(0,0,0,0.8),
    0 0 0 1px rgba(255,255,255,0.06),
    inset 0 0 60px rgba(0,0,0,0.3);
  animation: cardFloat 8s ease-in-out infinite;
}
.rk-hero-3d-card:hover {
  transform: rotateY(-4deg) rotateX(1deg) scale(1.02);
}
@keyframes cardFloat {
  0%, 100% { transform: rotateY(-10deg) rotateX(2deg) translateY(0px); }
  50%       { transform: rotateY(-10deg) rotateX(2deg) translateY(-12px); }
}

.rk-hero-3d-card img {
  width: 100%; height: 100%;
  display: block; object-fit: cover;
  max-height: 680px;
  filter: saturate(0.85) contrast(1.05) brightness(0.88);
}

/* two-panel hero layout */
.rk-hero-3d-card-grid {
  display: grid;
  grid-template-rows: 1.1fr 0.9fr;
  height: 100%;
  min-height: 520px;
  max-height: 680px;
}
.rk-hero-3d-card-grid img {
  max-height: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.rk-hero-3d-card-panel {
  position: relative;
  overflow: hidden;
}
.rk-hero-3d-card-panel:first-child {
  border-bottom: 2px solid rgba(232,200,74,0.25);
}

/* gloss sheen on the card */
.rk-hero-3d-sheen {
  position: absolute; inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.08) 0%,
    transparent 40%,
    transparent 60%,
    rgba(0,0,0,0.25) 100%
  );
  border-radius: 18px;
  pointer-events: none;
}

/* bottom fade so image bleeds into dark */
.rk-hero-3d-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 45%;
  background: linear-gradient(0deg, #060608 0%, transparent 100%);
  border-radius: 0 0 18px 18px;
  pointer-events: none;
}

/* left-side gradient to blend text side */
.rk-hero-3d-left-fade {
  position: absolute; top: 0; bottom: 0; left: -1px; width: 38%;
  background: linear-gradient(90deg, #060608 0%, transparent 100%);
  pointer-events: none;
}

/* gold accent line on card edge */
.rk-hero-3d-edge {
  position: absolute; top: 0; bottom: 0; left: 0; width: 3px;
  background: linear-gradient(180deg, transparent 0%, var(--gold) 30%, var(--gold) 70%, transparent 100%);
  opacity: 0.6;
}

/* decorative floating label on card */
.rk-hero-3d-badge {
  position: absolute;
  bottom: 2rem; left: 2rem;
  background: rgba(10,10,10,0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(232,200,74,0.35);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-family: var(--font-display);
  font-weight: 800; font-size: 0.75rem;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--gold);
  z-index: 2;
}


/* ── HERO CONTENT ── */
.rk-hero-content {
  position: relative; z-index: 6;
  padding: 0 6%;
  max-width: 640px;
  animation: heroIn 1s ease-out both;
}
@keyframes heroIn {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.rk-hero-eyebrow {
  font-family: var(--font-display);
  font-weight: 700; font-size: 0.95rem; letter-spacing: 4px;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 1.2rem;
  display: flex; align-items: center; gap: 0.8rem;
}
.rk-hero-eyebrow::before {
  content: ''; display: block;
  width: 40px; height: 2px; background: var(--gold);
}
/* 3D headline — strong depth, more layers */
.rk-hero h1 {
  font-family: var(--font-display);
  font-weight: 900; font-size: clamp(3.8rem, 9vw, 8rem);
  line-height: 0.92; text-transform: uppercase; letter-spacing: -1px;
  margin-bottom: 1.5rem;
  position: relative;
  color: #fff;
  text-shadow:
    1px 1px 0 rgba(0,0,0,0.95),
    2px 2px 0 rgba(0,0,0,0.9),
    3px 3px 0 rgba(0,0,0,0.88),
    4px 4px 0 rgba(0,0,0,0.85),
    5px 5px 0 rgba(0,0,0,0.82),
    6px 6px 0 rgba(0,0,0,0.8),
    7px 7px 0 rgba(0,0,0,0.78),
    8px 8px 0 rgba(0,0,0,0.75),
    9px 9px 0 rgba(0,0,0,0.72),
    10px 10px 0 rgba(0,0,0,0.7),
    12px 12px 0 rgba(0,0,0,0.65),
    14px 14px 0 rgba(0,0,0,0.6),
    16px 16px 24px rgba(0,0,0,0.55),
    0 6px 50px rgba(0,0,0,0.5);
  transform: perspective(600px) rotateX(-4deg) translateZ(20px);
  transform-origin: left center;
}
.rk-hero h1 em {
  font-style: italic;
  background: linear-gradient(90deg, var(--gold) 0%, #f5d987 50%, var(--gold) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(232,200,74,0.5));
  text-shadow:
    1px 1px 0 rgba(0,0,0,0.9),
    2px 2px 0 rgba(0,0,0,0.85),
    3px 3px 0 rgba(0,0,0,0.8),
    4px 4px 0 rgba(0,0,0,0.75),
    5px 5px 0 rgba(0,0,0,0.7),
    6px 6px 0 rgba(0,0,0,0.65),
    7px 7px 0 rgba(0,0,0,0.6),
    8px 8px 12px rgba(0,0,0,0.55);
}
.rk-hero-sub {
  font-size: 1.15rem; font-weight: 300; color: rgba(255,255,255,0.6);
  max-width: 480px; line-height: 1.7; margin-bottom: 2.5rem;
}
.rk-hero-actions { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
.rk-hero-scroll {
  position: absolute; right: 6%; bottom: 2.5rem;
  z-index: 6;
  font-family: var(--font-display);
  font-size: 0.78rem; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: rgba(255,255,255,0.25);
  writing-mode: vertical-lr; display: flex; align-items: center; gap: 0.8rem;
}
.rk-hero-scroll::after {
  content: ''; display: block;
  width: 1px; height: 60px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.25), transparent);
}
.rk-hero-scroll::after {
  content: ''; display: block;
  width: 1px; height: 60px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
}

/* Floating badge */
.rk-hero-badge {
  display: inline-flex; flex-direction: column; align-items: flex-start;
  border: 1px solid rgba(232,200,74,0.4);
  border-radius: 8px; padding: 0.7rem 1.2rem;
  background: rgba(232,200,74,0.07);
  backdrop-filter: blur(6px);
}
.rk-hero-badge-num {
  font-family: var(--font-display);
  font-size: 2.2rem; font-weight: 900; line-height: 1;
  color: var(--gold);
}
.rk-hero-badge-label {
  font-size: 0.75rem; font-weight: 600; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,255,255,0.6);
}
.rk-hero-badges { display: flex; gap: 1rem; margin-top: 3rem; flex-wrap: wrap; z-index: 6; position: relative; }

/* ── PASSES SECTION ── */
.rk-section { padding: 6rem 6%; }
.rk-section-label {
  font-family: var(--font-display);
  font-weight: 700; font-size: 0.85rem; letter-spacing: 4px;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 0.8rem;
  display: flex; align-items: center; gap: 0.7rem;
}
.rk-section-label::before {
  content: ''; width: 28px; height: 2px; background: var(--gold); flex-shrink: 0;
}
.rk-section-title {
  font-family: var(--font-display);
  font-weight: 900; font-size: clamp(2.2rem, 5vw, 3.8rem);
  text-transform: uppercase; line-height: 1;
  letter-spacing: -0.5px; margin-bottom: 0.6rem;
}
.rk-section-sub {
  font-size: 1.05rem; font-weight: 300; color: rgba(255,255,255,0.55);
  max-width: 500px; line-height: 1.6; margin-bottom: 3rem;
}

.rk-passes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5px;
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 12px; overflow: hidden;
}
.rk-pass-card {
  background: var(--charcoal);
  padding: 2.5rem 2rem;
  display: flex; flex-direction: column;
  transition: background 0.3s;
  cursor: pointer; position: relative; overflow: hidden;
}
.rk-pass-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--gold); transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s ease;
}
.rk-pass-card:hover::before { transform: scaleX(1); }
.rk-pass-card:hover { background: #222222; }

.rk-pass-tier {
  font-family: var(--font-display);
  font-weight: 800; font-size: 1.6rem; letter-spacing: 1px;
  text-transform: uppercase; margin-bottom: 0.4rem;
}
.rk-pass-tier.elite { color: var(--gold); }
.rk-pass-tier.pro   { color: #60a5fa; }
.rk-pass-tier.play  { color: #4ade80; }
.rk-pass-tier.select { color: #f87171; }

.rk-pass-tagline {
  font-size: 0.9rem; color: rgba(255,255,255,0.5); margin-bottom: 1.8rem;
  font-weight: 400; line-height: 1.5;
}
.rk-pass-features { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 2rem; }
.rk-pass-features li {
  display: flex; align-items: flex-start; gap: 0.7rem;
  font-size: 0.95rem; color: rgba(255,255,255,0.75); line-height: 1.4;
}
.rk-pass-features li::before {
  content: '→'; color: var(--gold); font-weight: 700; flex-shrink: 0; margin-top: 1px;
}
.rk-pass-cta {
  margin-top: auto; display: flex; gap: 0.8rem; flex-wrap: wrap;
}
.rk-btn-sm {
  font-family: var(--font-display);
  font-weight: 800; font-size: 0.82rem; letter-spacing: 2px;
  text-transform: uppercase; border: none; border-radius: 4px;
  cursor: pointer; transition: all 0.2s; padding: 0.55rem 1.2rem;
}
.rk-btn-sm-gold { background: var(--gold); color: var(--black); }
.rk-btn-sm-gold:hover { background: var(--gold-dim); }
.rk-btn-sm-ghost {
  background: transparent; color: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,255,255,0.15);
}
.rk-btn-sm-ghost:hover { color: var(--white); border-color: rgba(255,255,255,0.4); }

/* ── MARQUEE STRIP ── */
.rk-marquee-wrap {
  border-top: 1px solid rgba(255,255,255,0.07);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  overflow: hidden; padding: 1rem 0;
  background: var(--off-black);
}
.rk-marquee-track {
  display: flex; width: max-content;
  animation: marq 28s linear infinite;
}
@keyframes marq {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.rk-marquee-item {
  font-family: var(--font-display);
  font-weight: 900; font-size: 1rem; letter-spacing: 4px;
  text-transform: uppercase; color: rgba(255,255,255,0.15);
  padding: 0 2.5rem; white-space: nowrap; display: flex; align-items: center; gap: 2.5rem;
}
.rk-marquee-item span { color: var(--gold); font-size: 0.7rem; }

/* ── CATEGORIES GRID ── */
.rk-categories {
  background: var(--off-black);
  padding: 6rem 6%;
}
.rk-cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 12px; margin-top: 3rem;
}
.rk-cat-card {
  position: relative; border-radius: 8px; overflow: hidden;
  cursor: pointer; group: true;
}
.rk-cat-card:first-child { grid-column: span 2; grid-row: span 1; }
.rk-cat-card-inner {
  position: relative; padding-top: 75%;
  background: var(--dark-grey);
  overflow: hidden;
}
.rk-cat-card:first-child .rk-cat-card-inner { padding-top: 55%; }
.rk-cat-bg {
  position: absolute; inset: 0;
  transition: transform 0.5s ease;
  overflow: hidden;
}
.rk-cat-card:hover .rk-cat-bg { transform: scale(1.08); }
.rk-cat-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
}
.rk-cat-info {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 1.4rem 1.5rem;
}
.rk-cat-name {
  font-family: var(--font-display);
  font-weight: 900; font-size: 1.4rem;
  text-transform: uppercase; letter-spacing: 1px;
}
.rk-cat-sub { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin-top: 0.2rem; }
.rk-cat-tag {
  position: absolute; top: 1rem; right: 1rem;
  background: var(--gold); color: var(--black);
  font-family: var(--font-display); font-weight: 800;
  font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase;
  padding: 0.3rem 0.7rem; border-radius: 3px;
}

/* Category color themes */
.cat-strength .rk-cat-bg { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }
.cat-cardio   .rk-cat-bg { background: linear-gradient(135deg, #1a0a0a 0%, #2d1515 100%); }
.cat-hiit     .rk-cat-bg { background: linear-gradient(135deg, #0f1a0f 0%, #1a2d1a 100%); }
.cat-yoga     .rk-cat-bg { background: linear-gradient(135deg, #1a1020 0%, #2d1545 100%); }
.cat-combat   .rk-cat-bg { background: linear-gradient(135deg, #1a0f00 0%, #2d1e00 100%); }
.cat-swim     .rk-cat-bg { background: linear-gradient(135deg, #001a2d 0%, #00263d 100%); }

/* ── TRANSFORM CTA BAND ── */
.rk-transform {
  background: var(--gold);
  padding: 4rem 6%;
  display: flex; align-items: center; justify-content: space-between;
  gap: 2rem; flex-wrap: wrap;
}
.rk-transform-text h2 {
  font-family: var(--font-display);
  font-weight: 900; font-size: clamp(2rem, 4vw, 3.2rem);
  text-transform: uppercase; color: var(--black); line-height: 1;
  letter-spacing: -0.5px;
}
.rk-transform-text p {
  font-size: 1.05rem; color: rgba(0,0,0,0.65); margin-top: 0.6rem;
}
.rk-btn-dark {
  background: var(--black); color: var(--white);
  font-family: var(--font-display);
  font-weight: 800; font-size: 1rem; letter-spacing: 2px;
  text-transform: uppercase; border: none; border-radius: 4px;
  cursor: pointer; padding: 1rem 2.5rem; transition: all 0.2s;
  white-space: nowrap;
}
.rk-btn-dark:hover { background: #1a1a1a; transform: translateY(-2px); }

/* ── QUICK LINKS 4-GRID ── */
.rk-quick-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 1.5px; margin-top: 0;
  background: rgba(255,255,255,0.05);
}
.rk-quick-card {
  background: var(--charcoal);
  padding: 2.5rem 2.5rem;
  display: flex; flex-direction: column; justify-content: space-between;
  min-height: 220px; cursor: pointer; transition: background 0.3s; position: relative;
  overflow: hidden;
}
.rk-quick-card:hover { background: #222; }
.rk-quick-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.rk-quick-card h3 {
  font-family: var(--font-display);
  font-weight: 900; font-size: 1.8rem; text-transform: uppercase;
  letter-spacing: 0.5px; line-height: 1.1;
}
.rk-quick-card p { font-size: 0.9rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; }
.rk-quick-arrow {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 1.1rem; transition: all 0.25s;
}
.rk-quick-card:hover .rk-quick-arrow {
  background: var(--gold); border-color: var(--gold); color: var(--black);
}

/* ── APP DOWNLOAD ── */
.rk-app-section {
  background: var(--off-black);
  padding: 6rem 6%;
  display: flex; align-items: center; gap: 6rem; flex-wrap: wrap;
}
.rk-app-text { flex: 1; min-width: 280px; }
.rk-app-text h2 {
  font-family: var(--font-display);
  font-weight: 900; font-size: clamp(2rem, 4vw, 3rem);
  text-transform: uppercase; line-height: 1; letter-spacing: -0.5px;
  margin-bottom: 1rem;
}
.rk-app-text p {
  font-size: 1.05rem; font-weight: 300; color: rgba(255,255,255,0.55);
  max-width: 420px; line-height: 1.65; margin-bottom: 2rem;
}
.rk-app-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
.rk-store-btn {
  display: flex; align-items: center; gap: 0.8rem;
  background: var(--white); color: var(--black);
  border: none; border-radius: 8px; padding: 0.8rem 1.5rem;
  cursor: pointer; transition: all 0.2s; font-family: var(--font-body);
}
.rk-store-btn:hover { background: var(--off-white); transform: translateY(-2px); }
.rk-store-btn-icon { font-size: 1.8rem; line-height: 1; }
.rk-store-btn-text-top { font-size: 0.65rem; font-weight: 400; color: rgba(0,0,0,0.6); display: block; }
.rk-store-btn-text-main { font-size: 1rem; font-weight: 700; display: block; line-height: 1.2; }
.rk-app-mockup {
  flex: 0 0 300px; height: 340px;
  background: var(--dark-grey); border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
  font-size: 5rem; position: relative; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}
.rk-app-mockup::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(232,200,74,0.1) 0%, transparent 60%);
}
.rk-app-mockup-label {
  position: absolute; bottom: 1.5rem; left: 0; right: 0; text-align: center;
  font-family: var(--font-display);
  font-weight: 800; font-size: 1rem; letter-spacing: 3px; text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

/* ── JOIN SECTION ── */
.rk-join-section {
  padding: 6rem 6%;
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5px;
}
.rk-join-card {
  background: var(--charcoal); padding: 3.5rem 3rem;
  display: flex; flex-direction: column; gap: 1.5rem;
  position: relative; overflow: hidden; cursor: pointer; transition: background 0.3s;
}
.rk-join-card:hover { background: #222; }
.rk-join-card h3 {
  font-family: var(--font-display);
  font-weight: 900; font-size: clamp(1.8rem, 3vw, 2.5rem);
  text-transform: uppercase; line-height: 1.1; letter-spacing: -0.5px;
}
.rk-join-card p { font-size: 0.95rem; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 360px; }
.rk-join-deco {
  position: absolute; right: 2rem; top: 2rem;
  font-size: 5rem; opacity: 0.08;
}

/* ── FOOTER ── */
.rk-footer {
  background: var(--off-black);
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 4rem 6% 2rem;
}
.rk-footer-top {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem; margin-bottom: 3rem;
}
.rk-footer-brand p {
  font-size: 0.9rem; color: rgba(255,255,255,0.45);
  line-height: 1.65; margin-top: 1rem; max-width: 280px;
}
.rk-footer-col h4 {
  font-family: var(--font-display);
  font-weight: 800; font-size: 0.85rem; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem;
}
.rk-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
.rk-footer-col ul a {
  font-size: 0.9rem; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s;
}
.rk-footer-col ul a:hover { color: var(--white); }
.rk-footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.07);
  padding-top: 1.5rem;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: gap;
  gap: 1rem;
}
.rk-footer-copy {
  font-size: 0.82rem; color: rgba(255,255,255,0.25);
}
.rk-social { display: flex; gap: 0.8rem; }
.rk-social-btn {
  width: 36px; height: 36px; border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  color: rgba(255,255,255,0.5); background: none;
}
.rk-social-btn:hover { border-color: var(--gold); color: var(--gold); }

/* ── MOBILE NAV ── */
.rk-mobile-menu-btn {
  display: none; background: none; border: none;
  color: var(--white); font-size: 1.5rem; cursor: pointer;
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .rk-cat-grid { grid-template-columns: repeat(3, 1fr); }
  .rk-cat-card:first-child { grid-column: span 2; }
  .rk-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
}
@media (max-width: 768px) {
  .rk-nav-links { display: none; }
  .rk-mobile-menu-btn { display: block; }
  .rk-hero-badges { gap: 0.8rem; }
  .rk-cat-grid { grid-template-columns: 1fr 1fr; }
  .rk-cat-card:first-child { grid-column: span 2; }
  .rk-passes-grid { grid-template-columns: 1fr; }
  .rk-quick-grid { grid-template-columns: 1fr; }
  .rk-join-section { grid-template-columns: 1fr; }
  .rk-app-section { flex-direction: column; gap: 3rem; }
  .rk-app-mockup { width: 100%; flex: none; }
  .rk-footer-top { grid-template-columns: 1fr; }
  .rk-transform { flex-direction: column; }
}
@media (max-width: 480px) {
  .rk-section { padding: 4rem 5%; }
  .rk-cat-grid { grid-template-columns: 1fr; }
  .rk-cat-card:first-child { grid-column: span 1; }
}

/* ── SCROLL ANIMATION ── */
.rk-reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.rk-reveal.visible { opacity: 1; transform: translateY(0); }
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PASSES = [
  {
    tier: "elite",
    name: "RAGNAROK ELITE",
    tagline: "The ultimate all-access fitness experience",
    features: [
      "Unlimited group classes at all centers",
      "All ELITE & PRO gym access",
      "At-home live workout sessions",
      "Priority booking & personal trainer",
    ],
    badge: "MOST POPULAR",
  },
  {
    tier: "pro",
    name: "RAGNAROK PRO",
    tagline: "Full gym access with live training",
    features: [
      "Unlimited access to all PRO gyms",
      "2 sessions/month at ELITE gyms",
      "At-home live workouts",
      "Progress tracking dashboard",
    ],
  },
  {
    tier: "play",
    name: "RAGNAROK PLAY",
    tagline: "Sports & active recreation",
    features: [
      "Badminton, swimming & 8+ sports",
      "Guaranteed playing partner match",
      "Guided sessions with experts",
      "Weekly tournaments & leagues",
    ],
  },
  {
    tier: "select",
    name: "RAGNAROK SELECT",
    tagline: "Single center, maximum flexibility",
    features: [
      "Unlimited access to chosen center",
      "Limited sessions at other gyms",
      "At-home live workouts",
      "Starter personal training package",
    ],
  },
];

const CATEGORIES = [
  { cls: "cat-strength", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80", emoji: "🏋️", name: "Strength", sub: "Powerlifting · Olympic · Free Weights", tag: "TRENDING" },
  { cls: "cat-cardio",   img: "https://images.unsplash.com/photo-1549476464-37392f717541?w=500&q=80", emoji: "🏃", name: "Cardio",   sub: "Running · Cycling · Rowing" },
  { cls: "cat-hiit",     img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80", emoji: "⚡", name: "HIIT",     sub: "Tabata · CrossFit · Metabolic", tag: "HOT" },
  { cls: "cat-yoga",     img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80", emoji: "🧘", name: "Yoga",     sub: "Vinyasa · Power · Restorative" },
  { cls: "cat-combat",   img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&q=80", emoji: "🥊", name: "Combat",   sub: "Boxing · MMA · Kickboxing" },
  { cls: "cat-swim",     img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", emoji: "🏊", name: "Aquatics",  sub: "Lap Swimming · Water Aerobics" },
];

const QUICK_LINKS = [
  {
    title: "RAGNAROK\nTRANSFORM",
    sub: "Get coached to lose weight for good",
    accent: "#e8c84a",
    emoji: "🔥",
  },
  {
    title: "THE\nFIT WAY",
    sub: "Making health easy, one day at a time",
    accent: "#60a5fa",
    emoji: "💡",
  },
  {
    title: "WORKOUT\nGEAR",
    sub: "Everything you need for your workouts",
    accent: "#4ade80",
    emoji: "🎽",
  },
  {
    title: "SUGAR\nCHECK",
    sub: "Reverse Type 2 Diabetes & Prediabetes",
    accent: "#f87171",
    emoji: "❤️",
  },
];

const MARQUEE_ITEMS = [
  "GROUP CLASSES", "PERSONAL TRAINING", "OPEN GYM", "YOGA & WELLNESS",
  "COMBAT SPORTS", "AQUATICS", "HOME WORKOUTS", "SPORTS PLAY",
];

/* ─────────────────────────────────────────
   HOOK: scroll-reveal
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rk-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function RagnarokFitnessHome() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("fitness");
  useReveal();

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = CSS;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: "#0a0a0a" }}>

      {/* ── NAVBAR ── */}
      <header className={`rk-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="rk-logo">RAGNAROK<span>.</span>FIT</div>

        <ul className="rk-nav-links">
          {["FITNESS", "SPORTS", "STORE", "BLOG"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className={activeNav === item.toLowerCase() ? "active" : ""}
                onClick={(e) => { e.preventDefault(); setActiveNav(item.toLowerCase()); }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="rk-nav-right">
          <button className="rk-nav-city">
            📍 YOUR CITY
          </button>
          <button className="rk-btn rk-btn-outline">LOG IN</button>
          <button className="rk-btn rk-btn-gold">JOIN NOW</button>
          <button className="rk-mobile-menu-btn">☰</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="rk-hero" id="home">
        {/* Discipline image as full background behind "Break your limit" */}
        <div className="rk-hero-bg-image" />
        <div className="rk-hero-bg" />
        <div className="rk-hero-grain" />
        <div className="rk-hero-grid" />

<<<<<<< HEAD
        {/* ── HERO TEXT (3D headline over discipline bg) ── */}
=======
        {/* ── 3D IMAGE CARD (uploaded image) ── */}
        <div className="rk-hero-3d-wrap">
          {/* depth shadow layers */}
          <div className="rk-hero-3d-shadow-far" />
          <div className="rk-hero-3d-shadow-mid" />
          {/* main card */}
          <div className="rk-hero-3d-card">
    
            
            {/* glass sheen */}
            <div className="rk-hero-3d-sheen" />
            {/* bottom fade */}
            <div className="rk-hero-3d-fade" />
            {/* left side fade into text */}
            <div className="rk-hero-3d-left-fade" />
            {/* gold edge line */}
            <div className="rk-hero-3d-edge" />
            {/* floating label */}
            <div className="rk-hero-3d-badge">✦ RAGNAROK ATHLETE</div>
          </div>
        </div>

        {/* ── HERO TEXT ── */}
>>>>>>> 9f3b1411653ba7202952659163420755892d3a0b
        <div className="rk-hero-content">
          <p className="rk-hero-eyebrow">A fitness movement worth sweating for</p>
          <h1>
            BREAK YOUR<br />
            <em>LIMITS.</em><br />
            DAILY.
          </h1>
          <p className="rk-hero-sub">
            One membership. Unlimited group classes, elite gyms, sports, and live workouts.
            Join the RAGNAROK family and be better every day.
          </p>
          <div className="rk-hero-actions">
            <button className="rk-btn rk-btn-gold" style={{ padding: "0.9rem 2.5rem", fontSize: "1rem" }}>
              EXPLORE RAGNAROK PASS
            </button>
            <button className="rk-btn rk-btn-outline" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}>
              FIND A CENTER
            </button>
          </div>

          <div className="rk-hero-badges">
            {[
              { num: "5000+", label: "Active Members" },
              { num: "250+", label: "Expert Trainers" },
              { num: "50+", label: "Centers" },
              { num: "24/7", label: "Access" },
            ].map((b) => (
              <div className="rk-hero-badge" key={b.label}>
                <span className="rk-hero-badge-num">{b.num}</span>
                <span className="rk-hero-badge-label">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rk-hero-scroll">SCROLL</div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="rk-marquee-wrap">
        <div className="rk-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span className="rk-marquee-item" key={i}>
              {item} <span>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PASSES ── */}
      <section className="rk-section rk-reveal" id="fitness">
        <p className="rk-section-label">Membership</p>
        <h2 className="rk-section-title">ONE PASS.<br />ALL ACCESS.</h2>
        <p className="rk-section-sub">Choose the plan that matches your ambition. Upgrade anytime.</p>

        <div className="rk-passes-grid">
          {PASSES.map((pass) => (
            <div className="rk-pass-card" key={pass.tier}>
              {pass.badge && (
                <div style={{
                  position: "absolute", top: "1rem", right: "1rem",
                  background: "#e8c84a", color: "#000",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: "0.65rem", letterSpacing: "2px",
                  padding: "0.25rem 0.6rem", borderRadius: "3px",
                }}>
                  {pass.badge}
                </div>
              )}
              <div className={`rk-pass-tier ${pass.tier}`}>{pass.name}</div>
              <p className="rk-pass-tagline">{pass.tagline}</p>
              <ul className="rk-pass-features">
                {pass.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="rk-pass-cta">
                <button className="rk-btn-sm rk-btn-sm-gold">TRY FREE</button>
                <button className="rk-btn-sm rk-btn-sm-ghost">LEARN MORE</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="rk-categories rk-reveal">
        <p className="rk-section-label">What We Offer</p>
        <h2 className="rk-section-title">TRAIN YOUR WAY</h2>
        <p className="rk-section-sub">Trainer-led group classes across every discipline. Fun. Structured. Results-driven.</p>

        <div className="rk-cat-grid">
          {CATEGORIES.map((cat) => (
            <div className={`rk-cat-card ${cat.cls}`} key={cat.name}>
              <div className="rk-cat-card-inner">
                <div className="rk-cat-bg">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
                  />
                </div>
                <div className="rk-cat-overlay" />
                <div className="rk-cat-info">
                  <div className="rk-cat-name">{cat.name}</div>
                  <div className="rk-cat-sub">{cat.sub}</div>
                </div>
                {cat.tag && <div className="rk-cat-tag">{cat.tag}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRANSFORM BAND ── */}
      <div className="rk-transform">
        <div className="rk-transform-text">
          <h2>TRANSFORM YOUR BODY.<br />TRANSFORM YOUR LIFE.</h2>
          <p>Join a structured 8-week coaching program — designed for real, lasting results.</p>
        </div>
        <button className="rk-btn-dark">START RAGNAROK TRANSFORM →</button>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="rk-quick-grid rk-reveal">
        {QUICK_LINKS.map((ql) => (
          <div className="rk-quick-card" key={ql.title}>
            <div className="rk-quick-accent" style={{ background: ql.accent }} />
            <div>
              <h3 style={{ whiteSpace: "pre-line" }}>{ql.title}</h3>
              <p>{ql.sub}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: "2.5rem" }}>{ql.emoji}</span>
              <span className="rk-quick-arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── JOIN SECTION ── */}
      <section className="rk-join-section rk-reveal">
        <div className="rk-join-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=60')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(28,28,28,0.88)", borderRadius: "inherit" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
          <div className="rk-join-deco">🏆</div>
          <div>
            <h3>CAREERS AT<br />RAGNAROK</h3>
            <p>Be part of India's fastest-growing fitness movement. Coaches, ops, tech — we want the best.</p>
          </div>
          <button className="rk-btn rk-btn-gold" style={{ alignSelf: "flex-start" }}>VIEW OPENINGS →</button>
          </div>
        </div>
        <div className="rk-join-card" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=60')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(28,28,28,0.88)", borderRadius: "inherit" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
          <div className="rk-join-deco">🤝</div>
          <div>
            <h3>RAGNAROK<br />FRANCHISE</h3>
            <p>Partner with the largest fitness brand in the country. Own a center, build a community.</p>
          </div>
          <button className="rk-btn rk-btn-outline" style={{ alignSelf: "flex-start" }}>PARTNER WITH US →</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="rk-footer">
        <div className="rk-footer-top">
          <div className="rk-footer-brand">
            <div className="rk-logo" style={{ fontSize: "1.4rem" }}>RAGNAROK<span>.</span>FIT</div>
            <p>
              We make group workouts fun, daily nutrition healthy, mental fitness easy,
              and medical care hassle-free. #BeBetterEveryDay
            </p>
          </div>

          {[
            {
              title: "COMPANY",
              links: ["About Us", "Careers", "Press", "Blog", "Security"],
            },
            {
              title: "MEMBERSHIP",
              links: ["Ragnarok Elite", "Ragnarok Pro", "Ragnarok Play", "Ragnarok Select", "Gift a Pass"],
            },
            {
              title: "SUPPORT",
              links: ["Contact Us", "Privacy Policy", "Terms & Conditions", "Franchise", "Corporate"],
            },
          ].map((col) => (
            <div className="rk-footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rk-footer-bottom">
          <p className="rk-footer-copy">© 2025 RAGNAROK FITNESS. All rights reserved.</p>
          <div className="rk-social">
            {["𝕏", "f", "in", "▶", "📸"].map((icon, i) => (
              <button className="rk-social-btn" key={i}>{icon}</button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
