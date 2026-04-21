import { Link } from "react-router-dom";
import "./RagnarokFitnessHome.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80";

const FEATURES = [
  { icon: "🏋️", title: "Track Workouts", text: "Log sessions and see your history in one place." },
  { icon: "📊", title: "Monitor Progress", text: "Watch weight, calories, and goals over time." },
  { icon: "📋", title: "Easy Plans", text: "Pick a plan that fits — beginner to advanced." },
  { icon: "🔥", title: "Stay Motivated", text: "Simple reminders and streaks to keep you going." },
];

const PLANS = [
  {
    id: "beginner",
    name: "Beginner Plan",
    blurb: "3 days/week · full-body basics · low impact start",
  },
  {
    id: "weight-loss",
    name: "Weight Loss Plan",
    blurb: "Cardio + strength mix · calorie-focused routine",
  },
  {
    id: "muscle",
    name: "Muscle Gain Plan",
    blurb: "Progressive overload · split training · recovery tips",
  },
];

export default function RagnarokFitnessHome() {
  return (
    <div className="rk-home">
      <header className="rk-topbar">
        <div className="rk-topbar-inner">
          <span className="rk-logo">Ragnarok Fitness</span>
          <nav className="rk-topbar-nav">
            <a href="#features">Features</a>
            <a href="#sample-plans">Plans</a>
            <a href="#trainers">Trainers</a>
            <Link to="/login" className="rk-icon-login" title="Login">
              <span className="rk-profile-icon" aria-hidden>
                👤
              </span>
            </Link>
            <Link to="/login" className="rk-btn rk-btn--ghost">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="rk-hero">
          <div className="rk-hero-inner">
            <div className="rk-hero-copy">
              <p className="rk-hero-tag">Train smarter · Live stronger</p>
              <h1 className="rk-hero-title">
                Transform Your Body,
                <br />
                <span className="rk-hero-accent">Start Today</span> 💪
              </h1>
              <p className="rk-hero-sub">
                Build habits that last. Your dashboard is ready after login — track workouts, weight,
                and goals in a few clicks.
              </p>
              <div className="rk-hero-ctas">
                <Link to="/login" className="rk-btn rk-btn--primary">
                  Start Workout
                </Link>
                <a href="#sample-plans" className="rk-btn rk-btn--outline">
                  View Plans
                </a>
                <Link to="/signup" className="rk-btn rk-btn--red">
                  Join Now
                </Link>
              </div>
            </div>
            <div className="rk-hero-visual">
              <div className="rk-hero-img-wrap">
                <img src={HERO_IMG} alt="Gym workout" className="rk-hero-img" loading="lazy" />
                <div className="rk-hero-img-frame" aria-hidden />
              </div>
            </div>
          </div>
        </section>

        <section className="rk-section" id="features">
          <div className="rk-container">
            <h2 className="rk-section-title">Why train with us</h2>
            <p className="rk-section-lead">Everything you need to stay consistent — kept simple.</p>
            <div className="rk-feature-grid">
              {FEATURES.map((f) => (
                <article key={f.title} className="rk-feature-card">
                  <span className="rk-feature-icon" aria-hidden>
                    {f.icon}
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rk-section rk-section--dim" id="sample-plans">
          <div className="rk-container">
            <h2 className="rk-section-title">Sample workout plans</h2>
            <p className="rk-section-lead">Pick a path — details open in the app after you sign in.</p>
            <div className="rk-plan-grid">
              {PLANS.map((p) => (
                <article key={p.id} className="rk-plan-card" id={p.id}>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <Link to="/login" className="rk-btn rk-btn--small rk-btn--outline-light">
                    View
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rk-section">
          <div className="rk-container rk-progress-wrap">
            <div className="rk-progress-card">
              <h2 className="rk-section-title rk-section-title--left">Progress preview</h2>
              <p className="rk-progress-tagline">Track your daily workouts</p>
              <div className="rk-stat-row">
                <div>
                  <span className="rk-stat-num">12</span>
                  <span className="rk-stat-label">Workouts this month</span>
                </div>
                <div>
                  <span className="rk-stat-num">4</span>
                  <span className="rk-stat-label">This week (demo)</span>
                </div>
              </div>
              <div className="rk-mini-chart" aria-hidden>
                <div className="rk-bar" style={{ height: "40%" }} />
                <div className="rk-bar" style={{ height: "65%" }} />
                <div className="rk-bar" style={{ height: "45%" }} />
                <div className="rk-bar" style={{ height: "80%" }} />
                <div className="rk-bar" style={{ height: "55%" }} />
                <div className="rk-bar" style={{ height: "70%" }} />
                <div className="rk-bar" style={{ height: "50%" }} />
              </div>
              <p className="rk-progress-note">Sample data — your real stats appear on the dashboard.</p>
            </div>
          </div>
        </section>

        <section className="rk-section rk-section--dim" id="trainers">
          <div className="rk-container">
            <div className="rk-about-card">
              <h2 className="rk-section-title rk-section-title--left">Trainers &amp; guidance</h2>
              <p>
                Get guidance from expert trainers. Our team helps you train safely, fix form, and
                adjust plans as you grow stronger — whether you&apos;re just starting or pushing for
                your next PR.
              </p>
              <Link to="/signup" className="rk-btn rk-btn--primary rk-btn--inline">
                Get started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="rk-footer">
        <div className="rk-footer-inner">
          <div className="rk-footer-col">
            <strong className="rk-footer-brand">Ragnarok Fitness</strong>
            <p className="rk-footer-text">Mini project demo — train anywhere, track everything.</p>
          </div>
          <div className="rk-footer-col">
            <strong>Contact</strong>
            <p className="rk-footer-text">hello@ragnarok-fitness.demo</p>
            <p className="rk-footer-text">+91 00000 00000 (demo)</p>
          </div>
          <div className="rk-footer-col">
            <strong>Links</strong>
            <a href="#features">Features</a>
            <a href="#sample-plans">Plans</a>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>
          <div className="rk-footer-col">
            <strong>Social</strong>
            <div className="rk-social">
              <span title="Instagram">📷</span>
              <span title="YouTube">▶️</span>
              <span title="Twitter">𝕏</span>
            </div>
          </div>
        </div>
        <p className="rk-footer-copy">© {new Date().getFullYear()} Ragnarok Fitness · College mini project</p>
      </footer>
    </div>
  );
}
