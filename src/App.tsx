import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import {
  Github, Linkedin, Mail, ExternalLink, Terminal, Cpu,
  Brain, Globe, Code2, Layers, FileText, Sun, CloudSnow, Menu, X, Download
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface SkillCategory {
  category: string;
  items: string[];
  icon: React.ReactNode;
}

interface Project {
  num: string;
  title: string;
  desc: string;
  tech: string[];
  github: string;
  live: string | null;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const NAV_ITEMS = ['home', 'skills', 'projects', 'contact'];

const SKILLS: SkillCategory[] = [
  { category: 'Languages',      items: ['Python', 'C', 'Bash', 'JavaScript'],                               icon: <Code2 className="w-5 h-5" /> },
  { category: 'Cloud & DevOps', items: ['AWS', 'GCP', 'Docker', 'GitHub Actions', 'CI/CD'],                 icon: <Globe className="w-5 h-5" /> },
  { category: 'Linux & Systems',items: ['Arch Linux', 'Shell Scripting', 'System Automation', '/proc /sys'], icon: <Terminal className="w-5 h-5" /> },
  { category: 'Backend & APIs', items: ['FastAPI', 'REST APIs', 'Node.js', 'Bun'],                          icon: <Layers className="w-5 h-5" /> },
  { category: 'AI / NLP',       items: ['LLaMA', 'DeepSeek', 'Ollama', 'Prompt Engineering'],               icon: <Brain className="w-5 h-5" /> },
  { category: 'Core Concepts',  items: ['Infrastructure Automation', 'Networking', 'Logging', 'Monitoring'], icon: <Cpu className="w-5 h-5" /> },
];

const PROJECTS: Project[] = [
  {
    num: '01', title: 'Linux Diagnostic Tool',
    desc: 'A lightweight CLI system-monitoring tool written in C. Reads directly from the Linux kernel via /proc and /sys filesystems for CPU, memory, disk, and network metrics — no external dependencies. Exports JSON/CSV reports.',
    tech: ['C', 'GCC', 'Make', 'Arch Linux', '/proc', '/sys'],
    github: 'https://github.com/W0nder0fy0u/linux-diagnostic-tool', live: null,
  },
  {
    num: '02', title: 'SentiVox',
    desc: 'Multilingual sentiment analysis platform supporting English, Hindi, Marathi, and Tamil. Built on Bun with an LLM voting pipeline, REST APIs, word cloud generation, and Supabase authentication.',
    tech: ['Bun', 'ElysiaJS', 'Next.js', 'Supabase', 'NLP'],
    github: 'https://github.com/W0nder0fy0u/SentiVox', live: 'https://senti-vox.vercel.app',
  },
  {
    num: '03', title: 'Arch Linux Desktop Automation Suite',
    desc: 'A Linux desktop automation framework that auto-generates UI themes from wallpapers using pywal. Provides CLI tools for theme management, brightness, transparency, and system configuration on Arch Linux with i3wm.',
    tech: ['Python', 'Bash', 'pywal', 'i3wm', 'Arch Linux'],
    github: 'https://github.com/W0nder0fy0u', live: null,
  },
  {
    num: '04', title: 'ClawBot — Job Automation Bot',
    desc: 'An AI-powered job automation assistant (in development) that scrapes job platforms, ranks listings using LLM scoring, generates tailored cover letters, and sends real-time alerts through a Telegram bot.',
    tech: ['Python', 'Playwright', 'BeautifulSoup4', 'SQLite', 'Telegram API'],
    github: 'https://github.com/W0nder0fy0u', live: null,
  },
];

const SOCIALS = [
  { icon: <Github size={20} />,   href: 'https://github.com/W0nder0fy0u',                        label: 'GitHub' },
  { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/subham-tiwari-ab38971b4/', label: 'LinkedIn' },
  { icon: <Mail size={20} />,     href: 'mailto:subhamt958@gmail.com',                           label: 'Email' },
];

// Resume PDF URL — replace with your actual hosted PDF link
// e.g. from GitHub releases, Cloudinary, or your own domain
const RESUME_PDF_URL = '/resume.pdf';

const TREE_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i / 7) * 100,
  scale: 0.5 + Math.random() * 1.5,
  opacity: 0.03 + Math.random() * 0.08,
  parallaxFactor: 0.05 + Math.random() * 0.1,
}));

const PETAL_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  dur: 8 + Math.random() * 12,
  size: 4 + Math.random() * 6,
}));

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const fadeIn  = { hidden: { opacity: 0 },        show: { opacity: 1 } };

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nextX = (e.clientX / window.innerWidth - 0.5) * 20;
      const nextY = (e.clientY / window.innerHeight - 0.5) * 20;
      if (Math.abs(nextX - lastPos.current.x) > 0.5 || Math.abs(nextY - lastPos.current.y) > 0.5) {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          lastPos.current = { x: nextX, y: nextY };
          setPos({ x: nextX, y: nextY });
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);
  return pos;
}

function useActiveSection() {
  const [active, setActive] = useState('home');
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const found = NAV_ITEMS.find(id => {
          const el = document.getElementById(id);
          if (!el) return false;
          const { top, bottom } = el.getBoundingClientRect();
          return top <= 150 && bottom >= 150;
        });
        if (found) setActive(found);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);
  return active;
}

// ─── DECORATIVE COMPONENTS ────────────────────────────────────────────────────

const Petals = memo(({ theme }: { theme: string }) => {
  const isWinter = theme === 'winter';
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {PETAL_DATA.map(p => (
        <div key={p.id} className="petal will-change-transform" style={{
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.dur}s`,
          width: p.size, height: p.size,
          background: isWinter ? 'rgba(255,255,255,0.8)' : 'rgba(214,48,49,0.12)',
          boxShadow: isWinter ? '0 0 5px white' : 'none',
          borderRadius: isWinter ? '50%' : '50% 50% 50% 0',
        }} />
      ))}
    </div>
  );
});

const Tree = memo(({ theme, left, scale, opacity, parallaxFactor, mouseX }: {
  theme: string; left: number; scale: number; opacity: number; parallaxFactor: number; mouseX: number;
}) => {
  const borderColor = theme === 'winter' ? 'border-b-forest-navy' : 'border-b-ink-black';
  return (
    <motion.div
      className="absolute bottom-0 will-change-transform"
      style={{ left: `${left}%`, opacity, x: mouseX * parallaxFactor, scale, filter: 'blur(1px)' }}
    >
      <div className="flex flex-col items-center">
        <div className={`w-0 h-0 border-l-[30px] border-r-[30px] border-b-[60px] ${borderColor} border-l-transparent border-r-transparent`} />
        <div className={`w-0 h-0 border-l-[45px] border-r-[45px] border-b-[90px] ${borderColor} border-l-transparent border-r-transparent -mt-10`} />
        <div className={`w-0 h-0 border-l-[60px] border-r-[60px] border-b-[120px] ${borderColor} border-l-transparent border-r-transparent -mt-14`} />
        <div className={`w-0 h-0 border-l-[80px] border-r-[80px] border-b-[160px] ${borderColor} border-l-transparent border-r-transparent -mt-20`} />
        <div className={`w-8 h-24 ${theme === 'winter' ? 'bg-forest-navy' : 'bg-ink-black'} -mt-4`} />
      </div>
      {theme === 'winter' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-8 h-2 bg-snow-white blur-[1px] rounded-full" />
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-16 h-3 bg-snow-white blur-[1px] rounded-full" />
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-24 h-4 bg-snow-white blur-[1px] rounded-full" />
        </div>
      )}
    </motion.div>
  );
});

const ForestBackground = memo(({ theme, mouseX = 0 }: { theme: string; mouseX?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {TREE_DATA.map(t => <Tree key={t.id} {...t} theme={theme} mouseX={mouseX} />)}
  </div>
));

const BranchSVG = memo(({ theme, flip }: { theme: string; flip: boolean }) => {
  const stroke = theme === 'winter' ? 'var(--color-forest-navy)' : 'var(--color-ink-black)';
  return (
    <motion.div className={`absolute top-0 ${flip ? 'right-0 scale-x-[-1]' : 'left-0'} w-[min(300px,40vw)] opacity-80 will-change-transform`}>
      <svg viewBox="0 0 300 300" fill="none">
        <path d="M0,0 Q50,50 80,150 Q100,200 150,250" stroke={stroke} strokeWidth="3" />
        <path d="M40,40 Q80,20 120,40" stroke={stroke} strokeWidth="2" />
        <path d="M60,100 Q100,80 140,110" stroke={stroke} strokeWidth="1.5" />
        <path d="M20,150 Q60,180 40,220" stroke={stroke} strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
});

// ─── HERO SCENE ───────────────────────────────────────────────────────────────

const HeroScene = memo(({ theme }: { theme: string }) => {
  const mouse = useMouseParallax();
  const isWinter = theme === 'winter';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        {isWinter ? (
          <motion.div key="winter" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="absolute inset-0">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale-[0.2]"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1920")' }} />
            <div className="absolute inset-0 bg-linear-to-b from-snow-white/20 via-transparent to-snow-white/40" />
          </motion.div>
        ) : (
          <motion.div key="vagabond" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="absolute inset-0 opacity-10 grayscale contrast-125 mix-blend-multiply" />
        )}
      </AnimatePresence>

      {/* Glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,80vw)] aspect-square pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute inset-[-30%] rounded-full blur-[100px] ${isWinter ? 'bg-ice-blue' : 'bg-sun-red'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.8, 0.9, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full ${isWinter
            ? 'bg-snow-white shadow-[0_0_100px_rgba(255,255,255,0.3)]'
            : 'bg-sun-red shadow-[0_0_100px_rgba(214,48,49,0.3)]'}`}
        />
      </div>

      {/* Branches */}
      <motion.div style={{ x: mouse.x * 0.1, y: mouse.y * 0.1 }}>
        <BranchSVG theme={theme} flip={false} />
      </motion.div>
      <motion.div style={{ x: mouse.x * -0.1, y: mouse.y * 0.1 }}>
        <BranchSVG theme={theme} flip={true} />
      </motion.div>

      {/* Torii / pillar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(100px,20vw)] z-10"
      >
        {isWinter ? (
          <div className="w-full h-32 bg-forest-navy rounded-t-lg relative">
            <div className="absolute -top-4 -left-4 w-12 h-6 bg-snow-white rounded-full blur-sm" />
            <div className="absolute -top-4 -right-4 w-12 h-6 bg-snow-white rounded-full blur-sm" />
          </div>
        ) : (
          <svg viewBox="0 0 100 100" fill="var(--color-sun-red)">
            <g transform="translate(15,30)">
              <rect x="0" y="20" width="4" height="50" />
              <rect x="46" y="20" width="4" height="50" />
              <rect x="-10" y="15" width="70" height="6" rx="2" />
              <rect x="-5" y="28" width="60" height="4" rx="1" />
            </g>
          </svg>
        )}
      </motion.div>

      {/* Ground */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[15vh] ${isWinter ? 'bg-snow-white shadow-[0_-20px_50px_rgba(255,255,255,0.5)]' : 'bg-hill-red'}`}
        style={{ clipPath: 'ellipse(70% 100% at 50% 100%)' }}
      />
      <div className={`absolute bottom-0 left-0 w-[min(300px,35vw)] h-[min(400px,50vh)] ${isWinter ? 'bg-forest-navy' : 'bg-rock-navy'}`}
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 80% 60%, 40% 40%, 0 0)' }} />
      <div className={`absolute bottom-0 right-0 w-[min(300px,35vw)] h-[min(300px,40vh)] ${isWinter ? 'bg-forest-navy' : 'bg-rock-navy'}`}
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 60% 40%, 20% 60%)' }} />
    </div>
  );
});

// ─── NAV ──────────────────────────────────────────────────────────────────────

const Nav = memo(({ active, menuOpen, setMenuOpen }: {
  active: string;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <nav className="fixed top-8 left-0 right-0 z-100 flex justify-center px-6">
    <ul className="hidden md:flex gap-16">
      {NAV_ITEMS.map(id => (
        <li key={id}>
          <a href={`#${id}`}
            className={`font-jp text-2xl tracking-[0.1em] uppercase transition-all duration-300 pb-1 ${active === id
              ? 'text-ink-black border-b-2 border-sun-red'
              : 'text-ink-black/60 hover:text-ink-black'}`}>
            {id === 'contact' ? 'Contact Me' : id}
          </a>
        </li>
      ))}
    </ul>

    <button
      className="md:hidden fixed top-8 right-8 z-[150] p-3 bg-ink-black text-parchment-base rounded-full shadow-xl"
      onClick={() => setMenuOpen(o => !o)}
    >
      {menuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>

    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[140] bg-ink-black flex flex-col items-center justify-center gap-12"
        >
          {NAV_ITEMS.map(id => (
            <motion.a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}
              className="font-jp text-4xl text-parchment-base tracking-widest uppercase hover:text-sun-red transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {id}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
));

// ─── SKILL CARD ───────────────────────────────────────────────────────────────

const SkillCard = memo(({ cat, index }: { cat: SkillCategory; index: number }) => (
  <motion.div
    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
    transition={{ delay: index * 0.07 }}
    whileHover={{ y: -5 }}
    className="glass-card p-10 group transition-all duration-300 hover:bg-parchment-base/90 border-2 border-ink-black/5"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="text-samurai-muted-red group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
      <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-samurai-muted-red font-bold">{cat.category}</h3>
    </div>
    <div className="flex flex-wrap gap-3">
      {cat.items.map(s => (
        <span key={s} className="px-4 py-2 bg-ink-black/5 border-2 border-ink-black/5 text-ink-black font-bold text-base rounded-sm">
          {s}
        </span>
      ))}
    </div>
  </motion.div>
));

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => (
  <motion.div
    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="glass-card p-10 group transition-all duration-300 hover:bg-parchment-base/90 border-2 border-ink-black/5"
  >
    <div className="font-mono text-xs text-samurai-muted-red tracking-[0.3em] mb-6 uppercase font-bold">
      PROJECT {project.num}
    </div>
    <h3 className="font-mono text-3xl tracking-wider mb-6 group-hover:text-samurai-muted-red transition-colors text-ink-black font-bold">
      {project.title}
    </h3>
    <p className="font-serif text-lg leading-relaxed text-ink-black/80 mb-8 line-clamp-3 font-medium">{project.desc}</p>
    <div className="flex flex-wrap gap-3 mb-10">
      {project.tech.map(t => (
        <span key={t} className="px-3 py-1 border-2 border-samurai-muted-red text-samurai-muted-red font-mono text-xs uppercase rounded-xs font-bold">{t}</span>
      ))}
    </div>
    <div className="flex gap-8">
      <a href={project.github} target="_blank" rel="noreferrer"
        className="font-mono text-sm tracking-widest uppercase border-b-2 border-ink-black pb-1 flex items-center gap-2 hover:text-samurai-muted-red hover:border-samurai-muted-red transition-all font-bold">
        GitHub <ExternalLink size={14} />
      </a>
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer"
          className="font-mono text-sm tracking-widest uppercase border-b-2 border-ink-black pb-1 flex items-center gap-2 hover:text-samurai-muted-red hover:border-samurai-muted-red transition-all font-bold">
          Live Demo <ExternalLink size={14} />
        </a>
      )}
    </div>
  </motion.div>
));

// ─── SECTION HEADING ──────────────────────────────────────────────────────────

const SectionHeading = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-5 mb-20 relative">
    <span className="font-mono text-samurai-muted-red text-lg tracking-widest font-bold">{num} —</span>
    <h2 className="font-mono text-4xl md:text-6xl tracking-widest uppercase text-ink-black font-bold">{title}</h2>
    <div className="flex-1 h-px bg-ink-black/20" />
  </div>
);

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────

const ThemeToggle = memo(({ theme, setTheme }: {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <motion.div
    className="fixed top-6 left-6 z-[120] bg-ink-black/10 backdrop-blur-md p-1 rounded-full flex gap-1 border border-ink-black/10"
    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
  >
    <button onClick={() => setTheme('vagabond')} title="Vagabond Theme"
      className={`p-2 rounded-full transition-all ${theme === 'vagabond' ? 'bg-sun-red text-parchment-base shadow-lg' : 'text-ink-black hover:bg-ink-black/5'}`}>
      <Sun size={18} />
    </button>
    <button onClick={() => setTheme('winter')} title="Winter Theme"
      className={`p-2 rounded-full transition-all ${theme === 'winter' ? 'bg-forest-navy text-snow-white shadow-lg' : 'text-ink-black hover:bg-ink-black/5'}`}>
      <CloudSnow size={18} />
    </button>
  </motion.div>
));

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme]       = useState('vagabond');
  const active                  = useActiveSection();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Opens the resume PDF in a new tab (or triggers download)
  const openResume = useCallback(() => {
    window.open(RESUME_PDF_URL, '_blank', 'noopener,noreferrer');
  }, []);

  const isWinter = theme === 'winter';

  return (
    <div className={`min-h-screen selection:bg-samurai-muted-red selection:text-white relative transition-colors duration-700 ${isWinter ? 'bg-snow-white' : 'bg-parchment-base'}`}>

      {/* Fixed background */}
      <div className={`fixed inset-0 z-[-1] transition-colors duration-700 ${isWinter ? 'bg-snow-white' : 'bg-parchment-base parchment-grain'}`}>
        <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
        <div className={`absolute inset-0 cinematic-vignette ${isWinter ? 'opacity-20' : 'opacity-10'}`} />
      </div>

      <Petals theme={theme} />

      {/* Forest background (visible outside hero) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
        style={{ opacity: active !== 'home' ? 1 : 0, visibility: active !== 'home' ? 'visible' : 'hidden' }}
      >
        <ForestBackground theme={theme} />
      </div>

      <ThemeToggle theme={theme} setTheme={setTheme} />

      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-samurai-muted-red z-[110] origin-left" style={{ scaleX }} />

      <Nav active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Social sidebar */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-100 hidden sm:flex">
        {SOCIALS.map((s, i) => (
          <motion.a key={i} href={s.href} target="_blank" rel="noreferrer" title={s.label}
            whileHover={{ scale: 1.1, backgroundColor: '#d63031' }}
            className="w-10 h-10 bg-ink-black rounded-full flex items-center justify-center text-parchment-base transition-colors duration-300">
            {s.icon}
          </motion.a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroScene theme={theme} />
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center px-4"
        >
          <p className="font-mono text-sm tracking-[0.4em] uppercase text-ink-black/50 mb-4">
            DevOps · Cloud · Linux
          </p>
          <h1 className="font-jp text-6xl md:text-9xl tracking-widest mb-8 text-ink-black font-bold drop-shadow-sm">
            SUBHAM TIWARI
          </h1>
          <h2 className="font-jp text-xl md:text-3xl tracking-widest text-ink-black/70 mb-16 font-bold">
            BUILDING RELIABLE SYSTEMS FROM THE GROUND UP
          </h2>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#d63031' }} whileTap={{ scale: 0.95 }}
            onClick={openResume}
            className="group inline-flex items-center gap-3 bg-ink-black text-parchment-base px-10 py-4 rounded-full font-mono text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            Download Resume
          </motion.button>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <div className="bg-ink-charcoal text-parchment-base py-32 px-6 md:px-[10vw] grid md:grid-cols-2 gap-16 items-center relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <h2 className="font-mono text-5xl tracking-widest mb-8 uppercase font-bold">
            ABOUT <span className="text-samurai-muted-red">ME</span>
          </h2>
          <div className="w-24 h-2 bg-samurai-muted-red mb-8" />
          <p className="font-serif text-xl leading-relaxed text-parchment-base/90 mb-10 font-medium">
            DevOps and Cloud Engineer with hands-on experience in Linux system administration,
            infrastructure automation, and cloud platforms (AWS, GCP). I build CI/CD pipelines,
            backend services, and automation tooling focused on reliability and developer productivity.
            Currently pursuing an MCA at Graphic Era Deemed University, Dehradun.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 border-2 border-samurai-muted-red text-samurai-muted-red font-mono text-xs uppercase rounded-sm font-bold">MCA — Pursuing</span>
            <span className="px-4 py-2 border-2 border-parchment-base/30 text-parchment-base/80 font-mono text-xs uppercase rounded-sm font-bold">BCA Graduate</span>
            <span className="px-4 py-2 border-2 border-parchment-base/30 text-parchment-base/80 font-mono text-xs uppercase rounded-sm font-bold">Dehradun, Uttarakhand</span>
          </div>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
        >
          <blockquote className="font-serif italic text-2xl leading-loose text-parchment-base/80 border-l-4 border-samurai-muted-red pl-8 font-bold">
            "Automate everything that can be automated. Build systems that don't need you to babysit them."
          </blockquote>
        </motion.div>
      </div>

      {/* ── SKILLS ── */}
      <section id="skills" className="relative py-32 px-6 md:px-[10vw] overflow-hidden">
        <div className="relative z-10">
          <SectionHeading num="02" title="SKILLS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILLS.map((cat, i) => <SkillCard key={cat.category} cat={cat} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="relative py-32 px-6 md:px-[10vw] overflow-hidden">
        <div className="relative z-10">
          <SectionHeading num="03" title="PROJECTS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PROJECTS.map((p, i) => <ProjectCard key={p.num} project={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="relative py-32 px-6 md:px-[10vw] flex flex-col items-center text-center overflow-hidden">
        <div className="flex items-center gap-5 mb-20 w-full relative z-10">
          <span className="font-mono text-ink-black/40 text-lg tracking-widest font-bold">04 —</span>
          <h2 className="font-mono text-4xl md:text-6xl tracking-widest uppercase text-ink-black font-bold">CONTACT ME</h2>
          <div className="flex-1 h-px bg-ink-black/20" />
        </div>

        <motion.h2
          variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          className="font-mono text-5xl md:text-8xl tracking-wider mb-10 text-ink-black relative z-10 font-bold"
        >
          LET'S <span className="text-samurai-muted-red">CONNECT</span>
        </motion.h2>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-ink-black/80 max-w-2xl mb-16 relative z-10 font-medium">
          Open to DevOps, Cloud, and Linux engineering roles. Feel free to reach out — let's build something reliable together.
        </p>

        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <motion.a whileHover={{ scale: 1.05, backgroundColor: '#8b0000' }} href="mailto:subhamt958@gmail.com"
            className="px-10 py-5 bg-ink-black text-parchment-base font-mono text-sm tracking-[0.2em] uppercase rounded-sm transition-colors font-bold">
            Send Email
          </motion.a>
          <motion.button whileHover={{ scale: 1.05, backgroundColor: '#d63031' }} onClick={openResume}
            className="px-10 py-5 bg-ink-black text-parchment-base font-mono text-sm tracking-[0.2em] uppercase rounded-sm transition-colors flex items-center gap-3 font-bold shadow-xl">
            <FileText size={18} /> Resume
          </motion.button>
          <motion.a whileHover={{ scale: 1.05, borderColor: '#8b0000', color: '#8b0000' }}
            href="https://github.com/W0nder0fy0u" target="_blank" rel="noreferrer"
            className="px-10 py-5 border-2 border-ink-black/30 text-ink-black font-mono text-sm tracking-[0.2em] uppercase rounded-sm transition-colors font-bold">
            GitHub
          </motion.a>
        </div>

        <footer className="mt-32 pt-12 border-t border-ink-black/10 w-full font-mono text-xs md:text-sm tracking-[0.2em] text-ink-black/40 relative z-10 font-bold">
          © {new Date().getFullYear()} SUBHAM TIWARI · DEHRADUN, UTTARAKHAND · BUILT WITH DISCIPLINE
        </footer>
      </section>

      {/* Mobile socials */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-100">
        {SOCIALS.map((s, i) => (
          <a key={i} href={s.href}
            className="w-10 h-10 bg-ink-charcoal rounded-lg flex items-center justify-center text-parchment-base">
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
