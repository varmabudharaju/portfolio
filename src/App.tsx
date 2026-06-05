import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from 'motion/react';
import { Github, Linkedin, ExternalLink, Terminal, Cpu, Globe, ChevronRight, Menu, X, Database, Cloud, Activity, Code2, BookOpen, FileText, Coffee, Plane, Book, PenTool, Crown, Download, Package, ShieldCheck, Search, Network, HeartPulse, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchTopScores, submitScore, supabaseConfigured, sendMessage, contactConfigured } from './api';

// Pad a list of real scores out to three rows for the leaderboard display.
const padScores = (entries: { name: string; score: number }[]) => {
  const padded = [...entries];
  while (padded.length < 3) padded.push({ name: '---', score: 0 });
  return padded.slice(0, 3);
};

// --- Fun Interactive Components ---

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute w-3 h-3 bg-emerald-400 rounded-full mix-blend-screen"
        animate={{ 
          x: mousePosition.x - 6, 
          y: mousePosition.y - 6, 
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="absolute w-8 h-8 border border-emerald-400/50 rounded-full"
        animate={{ 
          x: mousePosition.x - 16, 
          y: mousePosition.y - 16, 
          scale: isHovering ? 1.5 : 1 
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </div>
  );
};

const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden md:block"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.03), transparent 80%)`
      }}
    />
  );
};

const ArcadeHoops = () => {
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number}[]>(padScores([]));
  const [isShooting, setIsShooting] = useState(false);
  const [message, setMessage] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempName, setTempName] = useState('');
  const [saving, setSaving] = useState(false);
  const hoopX = useMotionValue(0);

  // Load the global high scores from Supabase on mount.
  useEffect(() => {
    if (!supabaseConfigured) return;
    fetchTopScores(3)
      .then((scores) => setLeaderboard(padScores(scores)))
      .catch(() => { /* keep placeholders if the leaderboard can't be reached */ });
  }, []);

  useEffect(() => {
    // Easier: Slower base speed, wider travel but slower acceleration
    const duration = Math.max(1.2, 2.0 - score * 0.05);
    const controls = animate(hoopX, [-80, 80], {
      repeat: Infinity,
      repeatType: "reverse",
      duration: duration,
      ease: "easeInOut"
    });
    return controls.stop;
  }, [score, hoopX]);

  const shoot = () => {
    if (isShooting || showNameInput) return;
    setIsShooting(true);
    setMessage('');

    setTimeout(() => {
      const currentHoopX = hoopX.get();
      // Easier: Wider hitbox (40 instead of 30)
      if (Math.abs(currentHoopX) < 40) {
        setScore(s => s + 1);
        setMessage('SWISH! 🔥');
        setTimeout(() => setIsShooting(false), 500);
      } else {
        setMessage('BRICK! 🧱');
        setTimeout(() => {
          // Check if score qualifies for top 3
          const lowestTopScore = leaderboard[2].score;
          if (score > lowestTopScore && score > 0) {
            setShowNameInput(true);
          } else {
            setScore(0);
          }
          setIsShooting(false);
        }, 800);
      }
    }, 300); // Ball flight time
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = tempName.trim() ? tempName.trim().toUpperCase().slice(0, 8) : 'ANON';
    const entry = { name: finalName, score };

    // Optimistic local update so the board feels instant.
    setLeaderboard(prev =>
      padScores([...prev.filter(s => s.score > 0), entry].sort((a, b) => b.score - a.score).slice(0, 3))
    );

    if (supabaseConfigured) {
      setSaving(true);
      try {
        await submitScore(entry);
        const fresh = await fetchTopScores(3);
        setLeaderboard(padScores(fresh));
      } catch {
        /* keep the optimistic list if the save can't reach Supabase */
      } finally {
        setSaving(false);
      }
    }

    setScore(0);
    setShowNameInput(false);
    setTempName('');
    setMessage('');
  };

  return (
    <div className="w-full max-w-[320px] bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center relative overflow-hidden mx-auto">
      {/* Header / Leaderboard */}
      <div className="w-full flex flex-col gap-3 mb-4">
        <div className="bg-zinc-950/80 p-3 rounded-lg border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
            <Crown size={16} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest">LEADERBOARD</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-zinc-300' : 'text-orange-400'}`}>#{idx + 1}</span>
                  <span className={`text-xs font-bold font-mono tracking-wider ${idx === 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>{entry.name}</span>
                </div>
                <span className={`text-sm font-bold font-mono ${idx === 0 ? 'text-white' : 'text-zinc-500'}`}>{entry.score}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between px-1 mt-1">
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest">CURRENT SCORE</span>
          <span className="text-4xl font-bold text-white font-mono leading-none">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="w-full h-48 bg-zinc-950 rounded-xl border border-zinc-800/80 relative overflow-hidden flex justify-center shadow-inner">
        {/* Hoop */}
        <motion.div 
          className="absolute top-6 flex flex-col items-center z-10"
          style={{ x: hoopX }}
        >
          <div className="w-16 h-10 border-2 border-zinc-300 rounded-sm flex items-end justify-center pb-1 relative bg-white/5 backdrop-blur-sm">
            <div className="w-6 h-4 border border-emerald-500/50" />
          </div>
          <div className="w-8 h-1 bg-emerald-500 rounded-full mt-[-2px] z-20 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          {/* Net */}
          <div className="w-6 h-8 border-x border-b border-white/20 rounded-b-md" style={{ borderBottomStyle: 'dashed' }} />
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message && !showNameInput && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-xl tracking-widest z-30 drop-shadow-lg whitespace-nowrap"
              style={{ color: message.includes('SWISH') ? '#10B981' : '#EF4444' }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name Input Overlay */}
        <AnimatePresence>
          {showNameInput && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-4"
            >
              <span className="text-emerald-400 font-bold mb-1">TOP 3 SCORE!</span>
              <span className="text-2xl font-mono text-white mb-4">{score}</span>
              <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-2">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="ENTER NAME"
                  maxLength={8}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-center font-mono text-white uppercase focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <button type="submit" disabled={saving} className="w-full bg-emerald-500 text-zinc-950 font-bold py-2 rounded hover:bg-emerald-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> SAVING…</> : 'SAVE'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ball */}
        <motion.div 
          className="absolute w-8 h-8 bg-orange-500 rounded-full border-2 border-orange-700 z-20 overflow-hidden shadow-lg"
          initial={{ bottom: 12, scale: 1 }}
          animate={isShooting ? { bottom: 130, scale: 0.6 } : { bottom: 12, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute w-full h-px bg-orange-700 top-1/2 -translate-y-1/2" />
          <div className="absolute h-full w-px bg-orange-700 left-1/2 -translate-x-1/2" />
          <div className="absolute w-10 h-10 border border-orange-700 rounded-full -left-6 -top-1" />
          <div className="absolute w-10 h-10 border border-orange-700 rounded-full -right-6 -top-1" />
        </motion.div>
      </div>

      {/* Controls */}
      <button 
        onClick={shoot}
        disabled={isShooting || showNameInput}
        className="mt-5 w-full py-3 rounded-xl bg-white text-black font-bold tracking-widest hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
      >
        {isShooting ? 'SHOOTING...' : 'SHOOT'}
      </button>
    </div>
  );
};

const TiltCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

const TerminalHero = () => {
  const [text, setText] = useState('');
  const fullText = `> Initializing system...
> Loading AI modules...
> Fetching profile: Sai Ram Varma Budharaju
> Status: Ready.

Hello, World! 
I build scalable backend systems 
and AI-powered pipelines.`;
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-emerald-400 bg-zinc-950/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-800 shadow-2xl relative overflow-hidden group w-full max-w-lg mx-auto">
      <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-zinc-500">guest@sairam-portfolio:~</span>
      </div>
      <div className="pt-8 min-h-[220px]">
        <pre className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{text}<span className="animate-pulse">_</span></pre>
      </div>
    </div>
  );
};

// --- Layout Components ---

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Work', href: '#work' },
    { name: 'Resume', href: '#resume' },
    { name: 'Papers', href: '#papers' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-4' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tighter flex items-center gap-2 z-50">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-mono text-sm font-bold">SV</span>
          </div>
          <span className="hidden sm:block">Sai Ram Varma</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#contact" className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-zinc-200 transition-colors">
            Let's Talk
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 text-zinc-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full h-screen bg-[#050505] flex flex-col items-center justify-center gap-8 z-40"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const Hero = () => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div 
                className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900 shrink-0 cursor-pointer hover:border-emerald-500/50 transition-colors group relative"
                onClick={() => setIsImageExpanded(true)}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span className="text-white text-xs font-medium tracking-wider">EXPAND</span>
                </div>
                <img 
                  src="/profile.jpeg" 
                  alt="Sai Ram Varma Budharaju" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Software Developer / Engineer</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8"
            >
              Building scalable <br className="hidden md:block" />
              <span className="text-gradient">backend systems</span> <br className="hidden md:block" />
              & AI pipelines.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-xl mb-12 leading-relaxed"
            >
              I'm Sai Ram Varma Budharaju, a software engineer with 5+ years of experience specializing in scalable backend systems, async processing pipelines, and event-driven architectures — currently building real-time data systems at Uber.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a href="#work" className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2">
                View My Work <ChevronRight size={18} />
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="px-6 py-4 rounded-full border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all text-zinc-300 hover:text-white font-medium flex items-center gap-2">
                <Download size={18} /> Résumé
              </a>
              <a href="https://github.com/varmabudharaju" target="_blank" rel="noreferrer" className="p-4 rounded-full border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/sai-ram-varma-budharaju-b6467117a/" target="_blank" rel="noreferrer" className="p-4 rounded-full border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-8 items-center justify-center w-full"
          >
            <TiltCard className="w-full">
              <TerminalHero />
            </TiltCard>
            <TiltCard className="w-full">
              <ArcadeHoops />
            </TiltCard>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isImageExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={() => setIsImageExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute -top-12 right-0 md:-right-12 text-zinc-400 hover:text-white transition-colors p-2"
                onClick={() => setIsImageExpanded(false)}
              >
                <X size={32} />
              </button>
              <img 
                src="/profile.jpeg" 
                alt="Sai Ram Varma Budharaju" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const About = () => {
  const [activeTab, setActiveTab] = useState(0);

  const skills = [
    { 
      category: "Languages & Backend", 
      icon: <Code2 size={18} className="text-blue-400" />,
      items: [
        { name: "Python", icon: "devicon-python-plain" },
        { name: "Java", icon: "devicon-java-plain" },
        { name: "JavaScript", icon: "devicon-javascript-plain" },
        { name: "TypeScript", icon: "devicon-typescript-plain" },
        { name: "SQL", icon: "devicon-azuresqldatabase-plain" },
        { name: "Bash", icon: "devicon-bash-plain" },
        { name: "Django", icon: "devicon-django-plain" },
        { name: "FastAPI", icon: "devicon-fastapi-plain" },
        { name: "Flask", icon: "devicon-flask-original" },
        { name: "Spring Boot", icon: "devicon-spring-original" },
        { name: "GraphQL", icon: "devicon-graphql-plain" }
      ] 
    },
    { 
      category: "AI & Machine Learning", 
      icon: <Cpu size={18} className="text-purple-400" />,
      items: [
        { name: "LangChain", icon: "devicon-python-plain" },
        { name: "OpenAI API", icon: "devicon-python-plain" },
        { name: "RAG Pipelines", icon: "devicon-python-plain" },
        { name: "MCP", icon: "devicon-python-plain" },
        { name: "pgvector", icon: "devicon-postgresql-plain" },
        { name: "Federated Learning", icon: "devicon-pytorch-original" },
        { name: "Hugging Face", icon: "devicon-python-plain" },
        { name: "scikit-learn", icon: "devicon-scikitlearn-plain" },
        { name: "XGBoost", icon: "devicon-python-plain" },
        { name: "MLflow", icon: "devicon-python-plain" },
        { name: "Pandas", icon: "devicon-pandas-plain" },
        { name: "NumPy", icon: "devicon-numpy-plain" }
      ]
    },
    { 
      category: "Data & Distributed Systems", 
      icon: <Database size={18} className="text-emerald-400" />,
      items: [
        { name: "Apache Kafka", icon: "devicon-apachekafka-original" },
        { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
        { name: "MongoDB", icon: "devicon-mongodb-plain" },
        { name: "Redis", icon: "devicon-redis-plain" },
        { name: "Elasticsearch", icon: "devicon-elasticsearch-plain" },
        { name: "Airflow", icon: "devicon-apacheairflow-plain" },
        { name: "Spark", icon: "devicon-apachespark-original" },
        { name: "RabbitMQ", icon: "devicon-rabbitmq-original" }
      ] 
    },
    { 
      category: "Cloud & DevOps", 
      icon: <Cloud size={18} className="text-orange-400" />,
      items: [
        { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
        { name: "GCP", icon: "devicon-googlecloud-plain" },
        { name: "Docker", icon: "devicon-docker-plain" },
        { name: "Kubernetes", icon: "devicon-kubernetes-plain" },
        { name: "Terraform", icon: "devicon-terraform-plain" },
        { name: "Jenkins", icon: "devicon-jenkins-line" },
        { name: "Prometheus", icon: "devicon-prometheus-original" }
      ] 
    },
  ];

  return (
    <section id="about" className="py-32 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">About Me</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                I am a passionate Software Developer based in Bellevue, WA. With a Master of Science in Computer Science from the University of Florida, I have dedicated my career to building robust backend services and scalable data pipelines.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                My expertise spans across designing distributed systems, integrating AI-powered workflows, and optimizing cloud infrastructure. I thrive in environments where I can tackle complex engineering challenges and deliver high-performance solutions. When I'm not coding, I love playing basketball.
              </p>
              
              <TiltCard>
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm group">
                  <div className="relative z-10 p-6">
                    <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Globe size={18} className="text-zinc-400" /> Education
                    </h3>
                    <p className="text-zinc-100 font-bold text-lg">Master of Science in Computer Science</p>
                    <p className="text-zinc-300 font-medium">University of Florida</p>
                    <p className="text-emerald-400 text-sm font-mono mt-2">Graduated May 2024</p>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          </div>
          
          <div className="lg:col-span-7">
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-bold tracking-tighter mb-6">Technical Arsenal</h3>
              
              {/* Custom Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {skills.map((skill, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      activeTab === idx 
                        ? 'bg-white text-black' 
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {skill.icon}
                    {skill.category}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                  >
                    {skills[activeTab].items.map((item, i) => (
                      <TiltCard key={i}>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-colors h-full">
                          <i className={`${item.icon} text-xl text-zinc-400`} />
                          <span className="text-zinc-300 text-sm font-medium">{item.name}</span>
                        </div>
                      </TiltCard>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Hobbies Section */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold tracking-tighter mb-6">Hobbies & Interests</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "Books", icon: <Book size={24} className="text-blue-400" /> },
                    { name: "Whittling", icon: <PenTool size={24} className="text-purple-400" /> },
                    { name: "Travel", icon: <Plane size={24} className="text-emerald-400" /> },
                    { name: "Coffee", icon: <Coffee size={24} className="text-orange-400" /> }
                  ].map((hobby, i) => (
                    <TiltCard key={i}>
                      <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors h-full text-center">
                        {hobby.icon}
                        <span className="text-zinc-300 text-sm font-medium">{hobby.name}</span>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const jobs = [
    {
      company: "Uber",
      role: "Software Engineer",
      period: "Feb 2026 — Present",
      location: "USA",
      description: "Build real-time event ingestion pipelines with Kafka and Python for ride and support telemetry, achieving sub-100ms data freshness for dashboards used by 50+ support agents. Redesigned the query layer across MySQL and MongoDB via composite indexing and schema tuning, cutting p95 retrieval latency from 3.2s to 1.4s. Architected role-based REST APIs in Node.js/Express and integrated FastAPI + scikit-learn ticket classification, automating triage for 12K+ weekly tickets.",
      tech: ["Kafka", "Python", "MySQL", "MongoDB", "Node.js", "FastAPI", "EKS"]
    },
    {
      company: "Northeastern University",
      role: "Software Developer",
      period: "Mar 2025 — Dec 2025",
      location: "Washington, USA",
      description: "Built AI-powered grant-eligibility workflows using RAG with OpenAI GPT and LangChain, served via FastAPI with scikit-learn classifiers, processing 300+ records/cycle at 92% accuracy. Implemented event-driven enrollment pipelines with Apache Kafka and Spring Boot on AWS EKS (5K+ events/hour, zero loss), refactored 7 legacy auth modules to OAuth 2.0/JWT, and deployed Prometheus/Grafana monitoring.",
      tech: ["RAG", "OpenAI", "LangChain", "FastAPI", "Kafka", "Spring Boot", "Kubernetes"]
    },
    {
      company: "University of Florida",
      role: "Software Developer",
      period: "May 2024 — Feb 2025",
      location: "Florida, USA",
      description: "Developed REST APIs with FastAPI and PostgreSQL for research data access, reducing average query response time by 35% through indexing and query-plan optimization. Automated recurring ETL workflows with Apache Airflow (6h → 2h weekly), deployed microservices on AWS EKS with Docker/Kubernetes at 99.5% uptime, and set up OAuth 2.0 + GitHub Actions CI/CD.",
      tech: ["FastAPI", "PostgreSQL", "Airflow", "Docker", "Kubernetes", "AWS EKS"]
    },
    {
      company: "Tata Consultancy Services",
      role: "Software Developer / Assistant Systems Engineer",
      period: "Oct 2020 — Apr 2022",
      location: "India",
      description: "Built backend transaction services with Flask, SQLAlchemy, and Oracle integrating 4 financial source systems — 300K+ daily records at 99.9% settlement accuracy. Orchestrated 130+ daily settlement jobs with Celery and RabbitMQ (2h → 55min), shipped an XGBoost risk-scoring pipeline (87% precision), and engineered PySpark/Pandas pipelines consolidating 800K+ weekly records.",
      tech: ["Flask", "Oracle DB", "Celery", "RabbitMQ", "XGBoost", "PySpark"]
    },
    {
      company: "Airbnb",
      role: "Software Developer",
      period: "May 2019 — Sep 2020",
      location: "India",
      description: "Connected booking workflows to ML recommendation models via a Spring Boot → Flask inference shim on AWS EC2 (4.5K calls/day, p95 1.2s → 0.8s). Orchestrated nightly Airflow pipelines syncing PostgreSQL to Snowflake, and prototyped a TF-IDF + Elasticsearch semantic search over 1.2K property descriptions (sub-450ms p50).",
      tech: ["Spring Boot", "Flask", "Airflow", "Snowflake", "Elasticsearch"]
    }
  ];

  return (
    <section id="experience" className="py-32 relative border-t border-zinc-900 bg-zinc-950/50">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <FadeIn>
          <div className="flex items-center gap-4 mb-16">
            <Activity className="text-emerald-400" size={32} />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Professional Experience</h2>
          </div>
        </FadeIn>

        <div className="space-y-16">
          {jobs.map((job, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <TiltCard>
                <div className="relative pl-8 md:pl-0 group p-6 rounded-2xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/30 transition-all">
                  <div className="hidden md:block absolute left-[-40px] top-8 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-emerald-400 group-hover:bg-emerald-400/20 transition-colors z-10" />
                  {idx !== jobs.length - 1 && (
                    <div className="hidden md:block absolute left-[-33px] top-12 bottom-[-80px] w-[2px] bg-gradient-to-b from-zinc-800 to-transparent" />
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {job.role}
                      </h3>
                      <div className="text-lg text-zinc-300 font-medium mt-1">
                        {job.company} <span className="text-zinc-600 mx-2">•</span> <span className="text-zinc-400 text-sm">{job.location}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-mono text-zinc-400 whitespace-nowrap">
                      {job.period}
                    </span>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed mb-6 text-lg">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map((t, i) => (
                      <span key={i} className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// Branded gradient cover for projects without product screenshots
const ProjectCover: React.FC<{
  title: string;
  tagline: string;
  icon: React.ReactNode;
  gradient: string;
  command?: string;
}> = ({ title, tagline, icon, gradient, command }) => (
  <div className={`relative w-full h-full min-h-[260px] overflow-hidden ${gradient}`}>
    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
    <div className="relative z-10 h-full flex flex-col justify-between p-8">
      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-3xl font-bold text-white tracking-tight">{title}</h4>
        <p className="text-white/70 mt-1 text-sm font-medium">{tagline}</p>
        {command && (
          <code className="inline-block mt-4 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white/90 text-xs font-mono">
            <span className="text-emerald-300">$</span> {command}
          </code>
        )}
      </div>
    </div>
  </div>
);

// App-screenshot showcase: portrait phone frames over a branded gradient
const PhoneShowcase: React.FC<{
  phones: string[];
  icon: React.ReactNode;
  gradient: string;
}> = ({ phones, icon, gradient }) => (
  <div className={`relative w-full h-full min-h-[340px] overflow-hidden ${gradient}`}>
    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
    <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute top-6 left-6 z-20 w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white">
      {icon}
    </div>
    <div className="relative z-10 h-full flex items-end justify-center gap-3 px-6 pt-14">
      {phones.map((src, i) => {
        const isCenter = i === 1;
        return (
          <div
            key={i}
            className={`rounded-[1.4rem] border-[3px] border-zinc-900/80 bg-black shadow-2xl overflow-hidden ${isCenter ? "w-2/5 z-10 -mb-2" : "w-1/3 mb-6 opacity-90"}`}
            style={{ aspectRatio: '1284 / 2778' }}
          >
            <img src={src} alt="harmoniQ app screen" className="w-full h-full object-cover object-top" />
          </div>
        );
      })}
    </div>
  </div>
);

const linkMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  pypi: { label: "PyPI", icon: <Package size={15} /> },
  github: { label: "GitHub", icon: <Github size={15} /> },
  website: { label: "Website", icon: <Globe size={15} /> },
  appstore: { label: "App Store", icon: <Download size={15} /> },
  demo: { label: "Demo", icon: <ExternalLink size={15} /> },
};

const FeaturedCard: React.FC<{ project: any; reverse: boolean }> = ({ project, reverse }) => {
  const [activeImg, setActiveImg] = useState(0);
  const hasImages = project.images && project.images.length > 0;
  const hasPhones = project.phones && project.phones.length > 0;

  return (
    <div className={`group relative rounded-3xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/30 transition-colors flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
      {/* Visual */}
      <div className="lg:w-3/5 relative overflow-hidden bg-zinc-950 flex flex-col">
        {hasPhones ? (
          <PhoneShowcase phones={project.phones} icon={project.phoneIcon} gradient={project.phoneGradient} />
        ) : hasImages ? (
          <>
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={project.images[activeImg]}
                alt={`${project.title} screenshot`}
                className="w-full h-full object-cover object-top transition-transform duration-700"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
            </div>
            {project.images.length > 1 && (
              <div className="flex gap-2 p-3 bg-zinc-950 border-t border-zinc-900">
                {project.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative h-12 w-20 rounded-md overflow-hidden border transition-all ${activeImg === i ? "border-emerald-500" : "border-zinc-800 opacity-60 hover:opacity-100"}`}
                    aria-label={`View screenshot ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <ProjectCover {...project.cover} />
        )}
      </div>

      {/* Content */}
      <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          {project.badge && (
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              {project.badge}
            </span>
          )}
        </div>
        <p className="text-zinc-400 leading-relaxed mb-6">{project.description}</p>

        {project.highlights && (
          <ul className="space-y-2 mb-6">
            {project.highlights.map((h: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <ChevronRight size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 text-xs font-mono text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-auto">
          {project.links.map((link: any, i: number) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                link.primary
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
              }`}
            >
              {linkMeta[link.type]?.icon}
              {link.label || linkMeta[link.type]?.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const featuredProjects = [
    {
      title: "pgsemantic",
      badge: "PyPI · 144 tests",
      description: "Turn any PostgreSQL database into a semantic search engine in 60 seconds — no migrations, no separate vector DB, no pgvector expertise.",
      highlights: [
        "5 embedding providers (384–3,072 dims) with HNSW indexing and trigger-based auto-sync",
        "7-tool MCP server exposing semantic & hybrid search to AI agents over stdio/SSE",
        "Full CLI + web UI with cross-table search and embedding visualization",
      ],
      images: ["/projects/pgsemantic-search.png", "/projects/pgsemantic-visualize.png", "/projects/pgsemantic-crosstable.png"],
      tags: ["Python", "PostgreSQL", "pgvector", "FastAPI", "MCP"],
      links: [
        { type: "pypi", url: "https://pypi.org/project/pgsemantic/" },
        { type: "github", url: "https://github.com/varmabudharaju/pgsemantic" },
      ],
    },
    {
      title: "agent-pd",
      badge: "Dev tooling",
      description: "A \"police department\" for Claude Code subagents. A logging-only hook records every tool and permission event; the pd CLI correlates logs with transcripts and reports rule offenses with quoted evidence.",
      highlights: [
        "Hash-chained, tamper-evident audit log with off-host append-only sink",
        "Live \"police scanner\" feed of agent activity and rule violations",
        "Catch-and-report only — never blocks an agent mid-run",
      ],
      cover: {
        title: "agent-pd",
        tagline: "Audit & observability for AI agents",
        icon: <ShieldCheck size={26} />,
        gradient: "bg-gradient-to-br from-blue-600 via-indigo-700 to-zinc-900",
        command: "pd watch",
      },
      tags: ["Python", "CLI", "Claude Code", "Security", "Observability"],
      links: [
        { type: "github", url: "https://github.com/varmabudharaju/agent-pd" },
      ],
    },
    {
      title: "Chorus",
      badge: "PyPI · 165 tests",
      description: "Federated LoRA fine-tuning with mathematically exact aggregation. Implements FedEx-LoRA (ACL/ICLR 2025) to fix the flaw where standard FedAvg breaks for LoRA adapters.",
      highlights: [
        "SVD residual folding for exact federated aggregation of LoRA deltas",
        "FastAPI server with WebSocket round notifications and a full client SDK",
        "Gaussian differential privacy, Byzantine defenses, and safetensors-only serialization",
      ],
      cover: {
        title: "Chorus",
        tagline: "Federated LoRA fine-tuning framework",
        icon: <Network size={26} />,
        gradient: "bg-gradient-to-br from-emerald-600 via-teal-700 to-zinc-900",
        command: "pip install chorus-fl",
      },
      tags: ["Python", "Federated Learning", "LoRA", "PyTorch", "FastAPI"],
      links: [
        { type: "pypi", url: "https://pypi.org/project/chorus-fl/" },
        { type: "github", url: "https://github.com/varmabudharaju/chorus" },
      ],
    },
    {
      title: "harmoniQ",
      badge: "iOS · On-device AI",
      description: "An AI that learns your body. harmoniQ trains a personal ML model on your Apple Watch data — entirely on your iPhone. 12 health scores, a biological Health Age, and round-the-clock wellness monitoring. Your data never leaves your device.",
      highlights: [
        "Personal CoreML TCN model fine-tuned on-device with MLUpdateTask — no cloud",
        "Biological Health Age from a Gompertz hazard model across 12 health dimensions",
        "Privacy-preserving federated learning: only Laplace-noised weights leave the phone",
      ],
      phones: [
        "/projects/harmoniq-2-wellness.png",
        "/projects/harmoniq-1-dashboard.png",
        "/projects/harmoniq-3-trends.png",
      ],
      phoneIcon: <HeartPulse size={22} />,
      phoneGradient: "bg-gradient-to-br from-rose-500 via-fuchsia-700 to-indigo-900",
      tags: ["Swift", "CoreML", "Federated Learning", "HealthKit", "iOS"],
      links: [
        { type: "appstore", url: "https://apps.apple.com/us/app/harmoniq-health-monitor/id6761321112", primary: true },
        { type: "website", url: "https://varmabudharaju.github.io/harmoniq-website/" },
        { type: "github", url: "https://github.com/varmabudharaju/harmoniq-website" },
      ],
    },
    {
      title: "mongosemantic",
      badge: "PyPI",
      description: "Zero-config semantic search for any MongoDB database. Connects to your existing MongoDB, picks a text field, and makes it searchable by meaning — works on Atlas, replica sets, and standalone 7.0+.",
      highlights: [
        "Shadow or inline embeddings with Atlas index auto-creation",
        "Hybrid semantic + BM25 search fused via Atlas $rankFusion",
        "Online model migration with near-zero-downtime collection swap; MCP server included",
      ],
      cover: {
        title: "mongosemantic",
        tagline: "Semantic search for MongoDB",
        icon: <Search size={26} />,
        gradient: "bg-gradient-to-br from-green-600 via-emerald-800 to-zinc-900",
        command: "pip install mongosemantic",
      },
      tags: ["Python", "MongoDB", "Atlas", "Vector Search", "MCP"],
      links: [
        { type: "pypi", url: "https://pypi.org/project/mongosemantic/" },
        { type: "github", url: "https://github.com/varmabudharaju/mongosemantic" },
      ],
    },
  ];

  const otherProjects = [
    {
      title: "Shield Shot",
      description: "A security analysis tool designed to capture, analyze, and report on potential vulnerabilities in web applications.",
      tags: ["Security", "Python", "Analysis Tool"],
      link: "https://github.com/varmabudharaju/ShieldShot"
    },
    {
      title: "LumeShell (ShellBuddy)",
      description: "A modern AI-powered terminal emulator built with Electron, React 19, TypeScript, xterm.js, and node-pty — full PTY emulation and multi-tab support under 80ms latency.",
      tags: ["TypeScript", "Electron", "React", "Ollama", "OpenAI"],
      link: "https://github.com/varmabudharaju/LumeShell"
    },
    {
      title: "Fatigue Detection",
      description: "A computer vision system that detects driver fatigue in real time using facial landmarks and eye-aspect-ratio analysis.",
      tags: ["Python", "Computer Vision", "Machine Learning"],
      link: "https://github.com/varmabudharaju"
    },
    {
      title: "Care Companion",
      description: "An AI-powered healthcare assistant providing personalized care recommendations and health monitoring.",
      tags: ["AI", "Healthcare", "Web App"],
      link: "https://github.com/varmabudharaju"
    },
    {
      title: "Twitter Simulator",
      description: "A highly concurrent Twitter simulator built to handle massive message passing and state management.",
      tags: ["Erlang", "Concurrency", "Distributed Systems"],
      link: "https://github.com/varmabudharaju/twitter-simulator-dev"
    },
    {
      title: "Gossip Protocol",
      description: "Implementation of the Gossip Protocol for robust, decentralized information routing and state synchronization across network nodes.",
      tags: ["Erlang", "Networking", "Algorithms"],
      link: "https://github.com/varmabudharaju/Gossip"
    }
  ];

  return (
    <section id="work" className="py-32 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Selected Work</h2>
            <p className="text-zinc-400 text-lg max-w-xl">Open-source libraries and tools I build and ship — most are published on PyPI with full test suites.</p>
          </div>
        </FadeIn>

        {/* Featured projects */}
        <div className="space-y-8 mb-20">
          {featuredProjects.map((project, idx) => (
            <FadeIn key={idx} delay={idx * 0.05}>
              <FeaturedCard project={project} reverse={idx % 2 === 1} />
            </FadeIn>
          ))}
        </div>

        {/* Other projects */}
        <FadeIn>
          <h3 className="text-2xl font-bold tracking-tighter mb-8">More Projects</h3>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {otherProjects.map((project, idx) => (
            <FadeIn key={idx} delay={idx * 0.05}>
              <TiltCard className="h-full">
                <div className="group relative rounded-2xl p-6 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold">{project.title}</h4>
                    <a href={project.link} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0" aria-label={`View ${project.title}`}>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="flex justify-center mt-12">
            <a href="https://github.com/varmabudharaju" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-full text-lg font-medium text-white hover:bg-zinc-800 hover:border-emerald-500/50 transition-all shadow-lg">
              <Github size={20} /> Go to my GitHub for more
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Papers = () => {
  const papers = [
    {
      title: "Euclidian Travelling Sales Person Literature Survey",
      description: "A comprehensive literature survey exploring various algorithms, heuristics, and optimization techniques for solving the Euclidean Traveling Salesperson Problem.",
      link: "https://github.com/varmabudharaju/Euclidian-Travelling-Sales-Person-literature-survey",
      date: "Research Survey",
      tags: ["Algorithms", "Optimization", "Research"]
    },
    {
      title: "Tap n Ghost",
      description: "Research and analysis on the Tap 'n Ghost attack, exploring vulnerabilities in NFC-enabled devices and proposing mitigation strategies.",
      link: "https://github.com/varmabudharaju",
      date: "Security Research",
      tags: ["NFC", "Security", "Vulnerability Analysis"]
    },
    {
      title: "Threat Analysis in Computer Network Security",
      description: "A detailed threat analysis focusing on modern computer network security, identifying attack vectors, and evaluating defensive mechanisms.",
      link: "https://github.com/varmabudharaju",
      date: "Network Security",
      tags: ["Cybersecurity", "Threat Modeling", "Networks"]
    }
  ];

  return (
    <section id="papers" className="py-32 relative border-t border-zinc-900 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeIn>
          <div className="flex items-center gap-4 mb-16">
            <BookOpen className="text-purple-400" size={32} />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Papers & Research</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8">
          {papers.map((paper, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <TiltCard>
                <div className="group relative rounded-2xl p-8 bg-zinc-900 border border-zinc-800 hover:border-purple-500/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-zinc-500" size={24} />
                      <h3 className="text-2xl font-bold">{paper.title}</h3>
                    </div>
                    <a href={paper.link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0" aria-label={`View ${paper.title}`}>
                      <ExternalLink size={18} />
                    </a>
                  </div>
                  <p className="text-zinc-400 mb-6 leading-relaxed max-w-4xl">{paper.description}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-mono text-purple-400">{paper.date}</span>
                    <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
                    <div className="flex flex-wrap gap-2">
                      {paper.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-mono text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Resume = () => {
  return (
    <section id="resume" className="py-32 relative border-t border-zinc-900 bg-zinc-950/50">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <FadeIn>
          <TiltCard>
            <div className="relative rounded-3xl p-10 md:p-12 bg-zinc-900/60 border border-zinc-800 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-emerald-400" size={28} />
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Résumé</h2>
                  </div>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                    5+ years building scalable backend systems, async pipelines, and AI/ML infrastructure. Grab the full PDF for the complete history.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    <ExternalLink size={18} /> View Résumé
                  </a>
                  <a
                    href="/resume.pdf"
                    download="Sai-Ram-Varma-Budharaju-Resume.pdf"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-zinc-700 text-zinc-200 font-medium hover:border-emerald-500/50 hover:bg-zinc-900 transition-all"
                  >
                    <Download size={18} /> Download PDF
                  </a>
                </div>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>
    </section>
  );
};

const MessageForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await sendMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong. Please email me directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center">
        <CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={40} />
        <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
        <p className="text-zinc-400">Thanks for reaching out — I'll get back to you soon.</p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 font-medium">
          Send another
        </button>
      </div>
    );
  }

  const inputCls = "w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="text-left rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 md:p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputCls} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Message</label>
        <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="What's on your mind?" className={`${inputCls} resize-none`} />
      </div>

      {!contactConfigured && (
        <p className="text-sm text-amber-400/90">Heads up: the contact form isn't connected yet — add your Web3Forms key to enable sending.</p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-400">{error} You can also email me at <a href="mailto:sairam.vzf33@gmail.com" className="underline">sairam.vzf33@gmail.com</a>.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors text-lg disabled:opacity-60"
      >
        {status === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <><Send size={18} /> Send Message</>}
      </button>
    </form>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 relative border-t border-zinc-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
        <FadeIn>
          <p className="text-emerald-400 font-mono text-sm mb-4 tracking-wider uppercase">What's Next?</p>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">Get In Touch</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi — drop me a message below and it lands straight in my inbox.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <MessageForm />
          <p className="text-zinc-500 text-sm mt-6">
            Prefer email? Reach me directly at{' '}
            <a href="mailto:sairam.vzf33@gmail.com" className="text-zinc-300 hover:text-white underline transition-colors">sairam.vzf33@gmail.com</a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-8 border-t border-zinc-900 text-center bg-zinc-950 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm font-mono">
          Designed & Built by Sai Ram Varma Budharaju
        </p>
        <div className="flex items-center gap-4 text-zinc-500">
          <a href="https://github.com/varmabudharaju" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub"><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/sai-ram-varma-budharaju-b6467117a/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 relative">
      <CustomCursor />
      <MouseGlow />
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Resume />
        <Papers />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
