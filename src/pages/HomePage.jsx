import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  Dumbbell,
  History,
  Menu,
  Target,
  X,
} from 'lucide-react';
import './HomePage.css';

const features = [
  {
    icon: ClipboardList,
    title: 'Workout Tracking',
    description: 'Organize your training and record each workout session in one place.',
    color: 'mint',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Review your progress with clear visualizations as your training data builds.',
    color: 'blue',
  },
  {
    icon: Target,
    title: 'Fitness Goals',
    description: 'Set personal targets and keep your next milestone in sight.',
    color: 'purple',
  },
  {
    icon: History,
    title: 'Workout History',
    description: 'Look back at previous sessions and see how your training has evolved.',
    color: 'orange',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up and make FitTrack Pro your personal training space.',
  },
  {
    number: '02',
    title: 'Plan and record',
    description: 'Choose your workouts, then log sessions as you go.',
  },
  {
    number: '03',
    title: 'Review and improve',
    description: 'Use your workout history and progress to shape what comes next.',
  },
];

function Brand({ footer = false }) {
  return (
    <Link className={`landing-brand${footer ? ' landing-brand-footer' : ''}`} to="/" aria-label="FitTrack Pro home">
      <span className="landing-brand-icon"><Dumbbell size={21} strokeWidth={2.4} /></span>
      <span>FitTrack <strong>Pro</strong></span>
    </Link>
  );
}

function DashboardPreview() {
  return (
    <div className="preview-wrap" aria-label="Decorative preview of the FitTrack Pro workout dashboard">
      <div className="preview-glow" />
      <div className="preview-card">
        <div className="preview-topbar">
          <div className="preview-window-dots" aria-hidden="true"><i /><i /><i /></div>
          <span className="preview-label">YOUR TRAINING SPACE</span>
          <span className="preview-live"><span /> Preview</span>
        </div>
        <div className="preview-greeting">
          <div>
            <span className="preview-eyebrow">YOUR DASHBOARD</span>
            <h2>Keep showing up.</h2>
            <p>Your next session is one step away.</p>
          </div>
          <span className="preview-activity-icon"><Activity size={22} /></span>
        </div>
        <div className="preview-panels">
          <div className="preview-panel preview-session">
            <div className="preview-panel-heading">
              <span>WORKOUT PLANNER</span>
              <span className="preview-panel-icon"><Dumbbell size={15} /></span>
            </div>
            <div className="preview-session-title">Make today count</div>
            <div className="preview-session-line"><span /><span /><span /></div>
            <div className="preview-session-footer"><span>Plan your next workout</span><ArrowRight size={14} /></div>
          </div>
          <div className="preview-panel preview-goals">
            <div className="preview-panel-heading">
              <span>YOUR GOALS</span>
              <Target size={15} />
            </div>
            <div className="preview-goal-orbit">
              <div className="preview-goal-ring"><span><Check size={19} /></span></div>
              <span className="preview-orbit-dot" />
            </div>
            <span className="preview-goal-caption">Small steps add up</span>
          </div>
        </div>
        <div className="preview-history">
          <div className="preview-history-icon"><History size={17} /></div>
          <div><strong>Your training, in one place</strong><span>Sessions and progress at a glance</span></div>
          <ArrowDownRight size={17} />
        </div>
        <div className="preview-footer"><span>FITTRACK PRO</span><span>BUILT FOR YOUR JOURNEY</span></div>
      </div>
      <div className="preview-float preview-float-top"><span className="float-check"><Check size={14} /></span><span><strong>Consistency</strong><small>One workout at a time</small></span></div>
      <div className="preview-float preview-float-bottom"><span className="float-target"><Target size={17} /></span><span><strong>Your goals</strong><small>Progress at your pace</small></span></div>
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav landing-container" aria-label="Main navigation">
          <Brand />
          <button
            className="landing-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className={`landing-nav-links${menuOpen ? ' is-open' : ''}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <Link className="landing-login" to="/login" onClick={closeMenu}>Login <ArrowRight size={15} /></Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-copy">
              <div className="landing-kicker"><span className="kicker-pulse" /> YOUR JOURNEY. YOUR PACE.</div>
              <h1>Transform Your Fitness.<br /><span>Track Your Progress.</span></h1>
              <p className="landing-hero-subtitle">
                Your personal fitness companion to plan workouts, track performance, and stay consistent on your journey to a stronger, healthier you.
              </p>
              <div className="landing-hero-actions">
                <Link className="landing-button landing-button-primary" to="/register">Get Started Free <ArrowRight size={18} /></Link>
                <a className="landing-button landing-button-secondary" href="#features">Explore Features <ArrowDownRight size={17} /></a>
              </div>
              <div className="landing-hero-note"><span className="note-check"><Check size={13} /></span> Your training, organized around you</div>
            </div>
            <DashboardPreview />
          </div>
          <div className="landing-container landing-scroll-hint"><span /> SCROLL TO EXPLORE</div>
        </section>

        <section className="landing-about landing-section" id="about">
          <div className="landing-container landing-about-grid">
            <div className="landing-about-art" aria-hidden="true">
              <div className="about-ring about-ring-one" />
              <div className="about-ring about-ring-two" />
              <div className="about-center"><Dumbbell size={55} strokeWidth={1.4} /></div>
              <span className="about-chip about-chip-top"><Activity size={15} /> Show up for yourself</span>
              <span className="about-chip about-chip-bottom"><Check size={15} /> Progress, your way</span>
              <span className="about-spark about-spark-one">✳</span>
              <span className="about-spark about-spark-two">✳</span>
            </div>
            <div className="landing-section-copy">
              <span className="landing-eyebrow">A BETTER WAY TO TRAIN</span>
              <h2>Everything You Need to Reach Your Fitness Goals</h2>
              <p>FitTrack Pro brings your training routine together. Organize workouts, record each session, and revisit your workout history whenever you need a little perspective.</p>
              <p>Keep your goals visible and your progress easy to review—so you can stay motivated, build consistency, and focus on what matters: getting stronger on your terms.</p>
              <Link to="/register" className="landing-text-link">Start your journey <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="landing-features landing-section" id="features">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span className="landing-eyebrow">YOUR FITNESS TOOLKIT</span>
              <h2>Built around the way <span>you move.</span></h2>
              <p>Simple tools to plan, track, and keep moving forward.</p>
            </div>
            <div className="landing-feature-grid">
              {features.map(({ icon: Icon, title, description, color }, index) => (
                <article className={`landing-feature-card feature-${color}`} key={title} style={{ '--card-index': index }}>
                  <div className="feature-icon"><Icon size={22} strokeWidth={1.8} /></div>
                  <span className="feature-index">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="feature-arrow" aria-hidden="true"><ArrowRight size={17} /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-how landing-section" id="how-it-works">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span className="landing-eyebrow">A SIMPLE ROUTINE</span>
              <h2>Three steps. <span>One stronger you.</span></h2>
              <p>Getting started is easy. The progress is yours to make.</p>
            </div>
            <div className="landing-steps">
              {steps.map((step, index) => (
                <article className="landing-step" key={step.number}>
                  <div className="step-number">{step.number}{index < steps.length - 1 && <span className="step-connector" />}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta-section" id="contact">
          <div className="landing-container">
            <div className="landing-cta">
              <div className="cta-orb cta-orb-one" />
              <div className="cta-orb cta-orb-two" />
              <div className="cta-content">
                <span className="landing-eyebrow">READY WHEN YOU ARE</span>
                <h2>Your Fitness Journey<br /><span>Starts Here</span></h2>
                <p>Make space for the goals you want to reach. Start with one workout.</p>
                <Link className="landing-button landing-button-primary" to="/register">Get Started Free <ArrowRight size={18} /></Link>
              </div>
              <div className="cta-icon" aria-hidden="true"><Dumbbell size={82} strokeWidth={1.2} /></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-main">
            <div className="landing-footer-brand">
              <Brand footer />
              <p>Build consistency. Celebrate progress.<br />Keep moving forward.</p>
            </div>
            <div className="landing-footer-links">
              <span>EXPLORE</span>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
            </div>
            <div className="landing-footer-links">
              <span>YOUR ACCOUNT</span>
              <Link to="/login">Login</Link>
              <Link to="/register">Create an account</Link>
              <a href="#contact">Get started</a>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <span>© {new Date().getFullYear()} FitTrack Pro. All rights reserved.</span>
            <span>MADE FOR YOUR NEXT REP <Dumbbell size={13} /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
