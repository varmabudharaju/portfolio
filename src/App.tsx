import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from 'motion/react';
import { Github, Linkedin, ExternalLink, Terminal, Cpu, Globe, ChevronRight, Menu, X, Database, Cloud, Activity, Code2, BookOpen, FileText, Coffee, Plane, Book, PenTool, Crown } from 'lucide-react';

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
  const [highScore, setHighScore] = useState(0);
  const [topPlayer, setTopPlayer] = useState('GUEST');
  const [isShooting, setIsShooting] = useState(false);
  const [message, setMessage] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempName, setTempName] = useState('');
  const hoopX = useMotionValue(0);

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
          if (score > highScore && score > 0) {
            setShowNameInput(true);
          } else {
            setScore(0);
          }
          setIsShooting(false);
        }, 800);
      }
    }, 300); // Ball flight time
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = tempName.trim() ? tempName.trim().toUpperCase().slice(0, 8) : 'ANON';
    setTopPlayer(finalName);
    setHighScore(score);
    setScore(0);
    setShowNameInput(false);
    setTempName('');
    setMessage('');
  };

  return (
    <div className="w-full max-w-[320px] bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center relative overflow-hidden mx-auto">
      {/* Header / Top Player */}
      <div className="w-full flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between bg-zinc-950/80 p-2.5 rounded-lg border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest">HIGH SCORE</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-bold text-emerald-400 font-mono tracking-wider">{topPlayer}</span>
            <span className="text-xl font-bold text-white font-mono leading-none">{highScore}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-1">
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
              <span className="text-emerald-400 font-bold mb-1">NEW HIGH SCORE!</span>
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
                <button type="submit" className="w-full bg-emerald-500 text-zinc-950 font-bold py-2 rounded hover:bg-emerald-400 transition-colors">
                  SAVE
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
              I'm Sai Ram Varma Budharaju, an engineer with ~5 years of experience specializing in distributed systems, event-driven architectures, and cloud-native environments.
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
        { name: "scikit-learn", icon: "devicon-scikitlearn-plain" },
        { name: "TensorFlow", icon: "devicon-tensorflow-original" },
        { name: "NumPy", icon: "devicon-numpy-plain" },
        { name: "Pandas", icon: "devicon-pandas-plain" },
        { name: "XGBoost", icon: "devicon-python-plain" }, // Fallbacks to python icon
        { name: "LangChain", icon: "devicon-python-plain" },
        { name: "MLflow", icon: "devicon-python-plain" }
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
      company: "Northeastern University",
      role: "Software Developer",
      period: "Mar 2025 — Dec 2025",
      location: "Washington, USA",
      description: "Engineered distributed data services using Python and PostgreSQL deploying REST APIs on Kubernetes. Built AI-powered funding workflows using RAG with OpenAI GPT, LangChain, and MLflow. Implemented distributed event streaming pipelines using Apache Kafka and Java Spring Boot on AWS EKS.",
      tech: ["Python", "PostgreSQL", "Kubernetes", "OpenAI", "Kafka", "Spring Boot"]
    },
    {
      company: "University of Florida",
      role: "Software Developer",
      period: "May 2024 — Feb 2025",
      location: "Florida, USA",
      description: "Engineered backend data services using Python, Django, and MariaDB processing over 300K records per month. Maintained scheduled data processing workflows using Apache Airflow. Deployed containerized applications using Docker and OpenShift.",
      tech: ["Python", "Django", "MariaDB", "Airflow", "Docker", "OpenShift"]
    },
    {
      company: "Tata Consultancy Services",
      role: "Software Developer/Assistant Systems Engineer",
      period: "Oct 2020 — Apr 2022",
      location: "India",
      description: "Constructed backend transaction services using Flask, SQLAlchemy, and Oracle Database. Administered asynchronous task execution with Celery and RabbitMQ. Programmed data transformation workflows using Pandas and PySpark.",
      tech: ["Flask", "Oracle DB", "Celery", "RabbitMQ", "PySpark", "Quarkus"]
    },
    {
      company: "Airbnb",
      role: "Software Developer",
      period: "May 2019 — Sep 2020",
      location: "India",
      description: "Connected booking workflows to ML recommendations by introducing a Spring Boot to Flask inference shim on EC2. Orchestrated nightly Airflow pipelines from PostgreSQL to Snowflake. Prototyped semantic search using TF-IDF + Elasticsearch.",
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

const Work = () => {
  const selectedProjects = [
    {
      title: "LumeShell (ShellBuddy)",
      description: "A modern terminal emulator powered by AI. Built with Electron, React 19, TypeScript, xterm.js, and node-pty with full PTY emulation and multi-tab support under 80ms latency.",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop",
      tags: ["TypeScript", "Electron", "React", "Ollama", "OpenAI"],
      link: "https://github.com/varmabudharaju/LumeShell"
    },
    {
      title: "Fatigue Detection",
      description: "A computer vision system designed to detect driver fatigue in real-time using facial landmarks and eye aspect ratio analysis.",
      image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop",
      tags: ["Python", "Computer Vision", "Machine Learning"],
      link: "https://github.com/varmabudharaju"
    },
    {
      title: "Care Companion",
      description: "An AI-powered healthcare assistant application providing personalized care recommendations and health monitoring.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
      tags: ["AI", "Healthcare", "Web App"],
      link: "https://github.com/varmabudharaju"
    },
    {
      title: "Chorus",
      description: "A Python-based project focusing on advanced data processing and automation workflows.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop",
      tags: ["Python", "Automation", "Data Processing"],
      link: "https://github.com/varmabudharaju/chorus"
    },
    {
      title: "Twitter Simulator",
      description: "A highly concurrent Twitter simulator project built to handle massive message passing and state management.",
      image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=800&auto=format&fit=crop",
      tags: ["Erlang", "Concurrency", "Distributed Systems"],
      link: "https://github.com/varmabudharaju/twitter-simulator-dev"
    },
    {
      title: "Gossip Protocol",
      description: "Implementation of the Gossip Protocol for robust, decentralized information routing and state synchronization across network nodes.",
      image: "https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?q=80&w=800&auto=format&fit=crop",
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
            <p className="text-zinc-400 text-lg max-w-xl">A collection of my top open-source projects and technical explorations.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {selectedProjects.map((project, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className={idx === 0 ? "md:col-span-2" : ""}>
              <TiltCard className="h-full">
                <div className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 h-full flex flex-col ${idx === 0 ? "md:flex-row" : ""}`}>
                  <div className={`relative overflow-hidden ${idx === 0 ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-video"}`}>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10" />
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className={`p-8 flex flex-col flex-grow justify-center ${idx === 0 ? "md:w-1/2" : ""}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                      <a href={project.link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" aria-label={`View ${project.title}`}>
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    <p className="text-zinc-400 mb-8 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag, i) => (
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
            I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi, my inbox is always open.
          </p>
          <a href="mailto:sairamvarmabudharaju5@gmail.com" className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
            Say Hello
          </a>
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
        <Papers />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
