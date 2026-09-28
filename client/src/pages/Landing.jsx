import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  Bus,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  Gauge,
  Github,
  GraduationCap,
  Instagram,
  LayoutDashboard,
  Lightbulb,
  Linkedin,
  Lock,
  Menu,
  Repeat2,
  ScanLine,
  Send,
  ShieldAlert,
  Sparkles,
  Tags,
  Target,
  TrendingUp,
  Twitter,
  UserRound,
  Utensils,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How It Works' },
  { id: 'insights', label: 'Insights' },
  { id: 'faq', label: 'FAQ' },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070510]';

const CARD =
  'relative rounded-2xl border border-white/[0.08] bg-[#120C1F] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-40px_rgba(0,0,0,0.9)]';

const CARD_HOVER =
  'transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.25)]';

const INNER_PANEL = 'rounded-xl border border-white/[0.06] bg-[#0B0714]';

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, seen] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        seen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CtaLink({ to, variant = 'primary', children, className = '' }) {
  const base = `group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 ${FOCUS_RING} cursor-pointer`;
  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-[0_0_30px_-5px_rgba(147,51,234,0.6)] hover:shadow-[0_0_40px_2px_rgba(147,51,234,0.8)] hover:brightness-110 px-7 py-3.5',
    secondary:
      'border border-white/15 bg-white/5 text-slate-100 hover:border-purple-400/50 hover:bg-white/10 px-6 py-3.5 backdrop-blur-md',
    ghost:
      'border border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400/60 hover:bg-purple-500/20 px-5 py-3',
    text: 'text-slate-300 hover:text-white px-2 py-3',
  };
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

function Arrow({ size = 16 }) {
  return (
    <ArrowRight
      size={size}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  );
}

function NavItem({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative cursor-pointer border-0 bg-transparent px-1 py-1 text-[13.5px] font-medium text-slate-300 transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
    >
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-transform duration-300 group-hover:scale-x-100" />
    </button>
  );
}

function SectionHeading({ eyebrow, title, sub, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left' : 'mx-auto text-center';
  return (
    <Reveal className={`mb-14 max-w-2xl sm:mb-16 ${alignment}`}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-purple-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:text-[2.25rem] lg:text-[2.5rem]">
        {title}
      </h2>
      {sub ? (
        <p className="mt-5 text-[15px] leading-[1.7] text-slate-400">{sub}</p>
      ) : null}
    </Reveal>
  );
}

function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('cc_visited_first');
    if (!hasVisited) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('cc_visited_first', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 bg-black/80 backdrop-blur-md transition-all duration-500">
      <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-purple-500/30 bg-[#120C1F] p-6 shadow-[0_0_80px_rgba(168,85,247,0.35)] max-h-[90vh] overflow-y-auto sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close welcome dialog"
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
        >
          <X size={18} />
        </button>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Sparkles size={28} />
        </div>

        <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-400">
          Welcome to Campus Coin
        </span>

        <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Smart Financial Management For Students
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Take total control of your money, keep track of daily allowances, plan monthly budgets, and reach savings goals effortlessly.
        </p>

        <div className="mt-6 space-y-2.5 rounded-2xl border border-white/[0.06] bg-[#0B0714] p-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 size={16} className="shrink-0 text-purple-400" />
            <span>Track expenses and monthly income seamlessly</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 size={16} className="shrink-0 text-purple-400" />
            <span>Automated budget alerts and spending insights</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 size={16} className="shrink-0 text-purple-400" />
            <span>100% private, secure and bank-connection free</span>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleClose}
            className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all hover:shadow-[0_0_40px_rgba(147,51,234,0.8)] ${FOCUS_RING}`}
          >
            Get Started Now
            <Arrow size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CoinScene({ reduce }) {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      setFailed(true);
      return undefined;
    }
    if (!renderer || !renderer.getContext()) {
      setFailed(true);
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x2a1548, 3));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 7, 8);
    scene.add(keyLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 120, 40);
    purpleLight.position.set(3, -2, 5);
    scene.add(purpleLight);

    const indigoLight = new THREE.PointLight(0x6366f1, 90, 40);
    indigoLight.position.set(-4, 3, 5);
    scene.add(indigoLight);

    const root = new THREE.Group();
    scene.add(root);

    const createFaceTexture = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        10,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, '#3b1568');
      gradient.addColorStop(0.6, '#180833');
      gradient.addColorStop(1, '#080214');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = 'rgba(192, 132, 252, 0.95)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 48, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'rgba(168, 85, 247, 1)';
      ctx.shadowBlur = 32;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 230px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CC', size / 2, size / 2 + 10);
      ctx.shadowBlur = 0;

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const faceTexture = createFaceTexture();

    const faceMaterial = new THREE.MeshStandardMaterial({
      map: faceTexture,
      roughness: 0.25,
      metalness: 0.75,
      emissive: 0xa855f7,
      emissiveIntensity: 0.25,
      emissiveMap: faceTexture,
    });

    const sideMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3b1568,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.2,
    });

    const coinGeometry = new THREE.CylinderGeometry(1.9, 1.9, 0.32, 96, 1, false);
    const coin = new THREE.Mesh(coinGeometry, [sideMaterial, faceMaterial, faceMaterial]);
    coin.rotation.x = Math.PI / 2;
    root.add(coin);

    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    root.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    root.add(ring2);

    const dustCount = 50;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 9;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = event => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let frameId = 0;
    const startTime = performance.now();

    const animate = () => {
      const t = (performance.now() - startTime) / 1000;

      if (!reduce) {
        root.rotation.y = t * 0.45;
        ring1.rotation.z = t * 0.2;
        ring2.rotation.x = t * 0.25;
        root.position.y = Math.sin(t * 1.2) * 0.15;
        dust.rotation.y = t * 0.03;
      }

      pointer.x += (pointer.tx * 0.5 - pointer.x) * 0.08;
      pointer.y += (pointer.ty * 0.3 - pointer.y) * 0.08;
      root.rotation.x = -pointer.y * 0.4;
      root.rotation.z = pointer.x * 0.2;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const width = mount.clientWidth;
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const mats = Array.isArray(object.material) ? object.material : [object.material];
          mats.forEach(material => material.dispose());
        }
      });
      faceTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduce]);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 p-1 shadow-[0_0_80px_rgba(168,85,247,0.5)] sm:h-64 sm:w-64">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#080214]">
            <span className="text-4xl font-black tracking-tighter text-purple-200 sm:text-6xl">
              CC
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = id => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-6">
      <div
        className={`relative mx-auto max-w-[1150px] rounded-3xl border transition-all duration-500 sm:rounded-full ${
          scrolled
            ? 'border-white/15 bg-[#0e081c]/90 shadow-[0_20px_50px_-20px_rgba(147,51,234,0.3)] backdrop-blur-xl'
            : 'border-white/10 bg-[#0e081c]/80 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5 sm:py-3">
          <Link
            to="/"
            className={`flex shrink-0 items-center no-underline ${FOCUS_RING} rounded-lg`}
          >
            <span className="text-xl font-bold tracking-tight text-white">
              Campus <span className="text-purple-400">Coin</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map(link => (
              <NavItem key={link.id} onClick={() => go(link.id)}>
                {link.label}
              </NavItem>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <CtaLink
              to="/admin/login"
              variant="ghost"
              className="rounded-full border-purple-500/40 !bg-purple-500/10 !px-3.5 !py-1.5 hover:!bg-purple-500/20 text-[12.5px]"
            >
              <ShieldAlert size={14} className="text-purple-400" />
              Admin Login
            </CtaLink>
            <CtaLink to="/login" variant="text" className="!px-3 !py-1.5 text-[13.5px]">
              Login
            </CtaLink>
            <CtaLink
              to="/register"
              variant="primary"
              className="rounded-full !px-5 !py-2 text-[13px]"
            >
              Get Started
            </CtaLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen(value => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-purple-400/45 hover:text-white lg:hidden ${FOCUS_RING}`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open ? (
          <div className="cc-menu-in absolute left-0 top-full mt-2 w-full rounded-2xl border border-white/15 bg-[#0e081c]/95 p-5 shadow-2xl backdrop-blur-xl lg:hidden">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  className={`cursor-pointer rounded-lg border-0 bg-transparent px-3 py-3 text-left text-[15px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white ${FOCUS_RING}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <CtaLink to="/register" variant="primary" className="w-full justify-center">
                Get Started
                <Arrow size={16} />
              </CtaLink>
              <CtaLink to="/login" variant="secondary" className="w-full justify-center">
                User Login
              </CtaLink>
              <CtaLink to="/admin/login" variant="ghost" className="w-full justify-center">
                <ShieldAlert size={15} className="text-purple-400" />
                Admin Portal Login
              </CtaLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function Hero() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[#070510]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_20%,rgba(139,92,246,0.25),transparent_70%),radial-gradient(900px_circle_at_85%_75%,rgba(99,102,241,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-xl">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-purple-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-200">
                  Next-Gen Student Finance
                </span>
                <span className="flex items-center gap-1 rounded-full bg-purple-500/30 px-2 py-0.5 text-[11px] font-bold text-purple-300">
                  <Zap size={10} /> 2.0
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
                Master Your Money. <br />
                <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(168,85,247,0.3)]">
                  Elevate Student Life.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg">
                The modern, automated financial command center designed exclusively for
                students. Track allowances, set intelligent budgets, and hit your savings
                goals effortlessly.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                <CtaLink
                  to="/register"
                  variant="primary"
                  className="w-full text-base shadow-[0_0_40px_rgba(147,51,234,0.5)] sm:w-auto !px-8 !py-4"
                >
                  Start Free Today
                  <Arrow size={18} />
                </CtaLink>
                <CtaLink
                  to="/#features"
                  variant="secondary"
                  className="w-full text-base sm:w-auto !px-7 !py-4"
                >
                  Explore Features
                </CtaLink>
                <CtaLink
                  to="/admin/login"
                  variant="ghost"
                  className="w-full text-base sm:w-auto !px-6 !py-4"
                >
                  <ShieldAlert size={18} className="text-purple-400" />
                  Admin Login
                </CtaLink>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 grid w-full max-w-lg grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-white sm:text-3xl">100%</h4>
                  <p className="mt-1 text-xs text-slate-400">Free for Students</p>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-purple-300 sm:text-3xl">Zero</h4>
                  <p className="mt-1 text-xs text-slate-400">Bank Link Needed</p>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-white sm:text-3xl">256-bit</h4>
                  <p className="mt-1 text-xs text-slate-400">Encrypted Privacy</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="relative mt-8 flex items-center justify-center lg:col-span-5 lg:mt-0">
            <Reveal delay={200} className="w-full">
              <div className="relative mx-auto h-[350px] w-full max-w-[350px] sm:h-[550px] sm:max-w-[500px]">
                <div className="absolute inset-0 z-10">
                  <CoinScene reduce={reduce} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const points = [
    { icon: <BarChart3 size={15} />, label: 'Track Every Expense' },
    { icon: <Gauge size={15} />, label: 'Smart Budgeting' },
    { icon: <Target size={15} />, label: 'Savings Goals' },
    { icon: <Lightbulb size={15} />, label: 'Financial Insights' },
  ];

  return (
    <section className="relative border-y border-white/[0.06] bg-[#0A0614]">
      <div className="mx-auto max-w-[1180px] px-5 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:divide-x sm:divide-white/[0.08] sm:gap-x-0">
          {points.map(point => (
            <div
              key={point.label}
              className="flex items-center gap-2.5 sm:justify-center sm:px-6"
            >
              <span className="text-purple-400">{point.icon}</span>
              <p className="text-[12.5px] font-medium text-slate-300">{point.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: <ScanLine size={17} />,
      title: 'Untracked daily spending',
      desc: 'Small purchases add up fast and disappear from memory within days.',
    },
    {
      icon: <TrendingUp size={17} />,
      title: 'Overspending',
      desc: 'Without a running total, it is easy to spend more than a month allows.',
    },
    {
      icon: <Gauge size={17} />,
      title: 'Difficult budgeting',
      desc: 'Spreadsheets and notes apps are tedious to keep up with every week.',
    },
    {
      icon: <Repeat2 size={17} />,
      title: 'Forgotten subscriptions',
      desc: 'Recurring payments quietly drain accounts long after they are useful.',
    },
    {
      icon: <Target size={17} />,
      title: 'No clear savings plan',
      desc: 'Saving "whatever is left" rarely adds up to a real goal.',
    },
    {
      icon: <Brain size={17} />,
      title: 'Unclear spending patterns',
      desc: 'Without reports, it is hard to know where money actually goes each month.',
    },
  ];

  return (
    <section className="relative py-16 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The everyday problem"
          title="Where does your money go?"
          sub="Most students juggle allowance, part-time income and dozens of small expenses without a clear picture of any of it."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <Reveal key={problem.title} delay={(index % 3) * 80}>
              <div className={`${CARD} ${CARD_HOVER} flex h-full flex-col p-5 sm:p-6`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                  {problem.icon}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-white">{problem.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-slate-400">{problem.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <ScanLine size={17} />,
      title: 'Expense Tracking',
      desc: 'Log every purchase in seconds and see it reflected instantly.',
    },
    {
      icon: <Wallet size={17} />,
      title: 'Income Tracking',
      desc: 'Record allowance, part-time work, scholarships and gifts.',
    },
    {
      icon: <Gauge size={17} />,
      title: 'Smart Budgets',
      desc: 'Set category limits and get alerted before you overspend.',
    },
    {
      icon: <Target size={17} />,
      title: 'Savings Goals',
      desc: 'Set a target, track progress, and watch it grow over time.',
    },
    {
      icon: <Tags size={17} />,
      title: 'Spending Categories',
      desc: 'Organize transactions into categories that fit your life.',
    },
    {
      icon: <BarChart3 size={17} />,
      title: 'Reports and Analytics',
      desc: 'Weekly and monthly breakdowns of where your money went.',
    },
    {
      icon: <Lightbulb size={17} />,
      title: 'Saving Tips',
      desc: 'Practical suggestions based on your own spending habits.',
    },
    {
      icon: <Brain size={17} />,
      title: 'Financial Insights',
      desc: 'Plain-language summaries that explain what changed and why.',
    },
    {
      icon: <Bell size={17} />,
      title: 'Notifications',
      desc: 'Budget alerts and account updates, right when they matter.',
    },
    {
      icon: <FileSpreadsheet size={17} />,
      title: 'Transaction Management',
      desc: 'Edit, categorize, or remove any income or expense entry.',
    },
    {
      icon: <UserRound size={17} />,
      title: 'Profile Management',
      desc: 'Keep your account details and preferences up to date.',
    },
    {
      icon: <LayoutDashboard size={17} />,
      title: 'Personalized Dashboard',
      desc: 'One overview built around your own balance and goals.',
    },
  ];

  return (
    <section
      id="features"
      className="relative scroll-mt-28 border-y border-white/[0.06] bg-[#0A0614] py-16 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to manage your money"
          sub="Twelve focused tools, one connected platform — nothing to juggle across separate apps."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 3) * 70}>
              <div className={`${CARD} ${CARD_HOVER} flex h-full flex-col p-5 sm:p-6`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-300">
                    {feature.icon}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400/60" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-slate-400">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardShowcase() {
  const metrics = [
    { label: 'Total Balance', value: 'Rs 12,400', highlight: true },
    { label: 'Monthly Income', value: 'Rs 25,000' },
    { label: 'Monthly Expenses', value: 'Rs 12,600' },
    { label: 'Savings', value: 'Rs 6,000' },
  ];
  const bars = [42, 68, 55, 80, 35, 62, 48];

  return (
    <section className="relative py-16 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Product preview"
          title="One dashboard. Complete financial clarity."
          sub="Balance, budgets, savings and recent activity — everything you need to check in on your money, in a single screen."
        />

        <Reveal>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-4 -top-10 bottom-0 rounded-[40px] bg-[radial-gradient(640px_circle_at_50%_0%,rgba(168,85,247,0.22),transparent_70%)] blur-2xl sm:-inset-x-8" />

            <div className="relative overflow-hidden rounded-[20px] border border-white/15 bg-[#120C1F] shadow-[0_40px_100px_-30px_rgba(147,51,234,0.3)] sm:rounded-[26px]">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] bg-[#0A0614] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <p className="text-[12px] font-semibold text-slate-100 sm:text-[13px]">
                    Campus Coin — Overview
                  </p>
                </div>
                <p className="hidden text-[11.5px] text-slate-500 sm:block">September 2026</p>
              </div>

              <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_300px] lg:p-6">
                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    {metrics.map(metric => (
                      <div
                        key={metric.label}
                        className={`rounded-lg border p-2.5 sm:p-3 ${
                          metric.highlight
                            ? 'border-purple-400/30 bg-purple-500/10'
                            : 'border-white/[0.07] bg-[#1a122c]'
                        }`}
                      >
                        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-[9px]">
                          {metric.label}
                        </p>
                        <p className="mt-1.5 text-[12px] font-semibold tracking-tight text-white sm:text-[13.5px] lg:text-[15px]">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className={`${INNER_PANEL} p-3 sm:p-5`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">
                        Spending Overview
                      </p>
                      <p className="text-[10px] text-slate-500 sm:text-[11px]">Last 7 days</p>
                    </div>
                    <div className="mt-4 flex h-20 items-end gap-1.5 sm:h-32 sm:gap-2.5">
                      {bars.map((height, index) => (
                        <div
                          key={index}
                          style={{ height: `${height}%` }}
                          className="flex-1 rounded-t bg-gradient-to-t from-purple-800 to-purple-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className={`${INNER_PANEL} p-3 sm:p-4`}>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
                      Budget pulse
                    </p>
                    <p className="mt-1.5 text-base font-semibold tracking-tight text-white sm:mt-2 sm:text-lg">
                      68%
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1a122c]">
                      <div className="h-1.5 w-[68%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                    </div>
                  </div>

                  <div className="rounded-lg border border-purple-400/25 bg-[#0A0614] p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className="text-purple-300" />
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-300 sm:text-[10px]">
                        Insight preview
                      </p>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-[1.6] text-slate-300 sm:mt-2 sm:text-[12px]">
                      Food spending is trending higher this month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: <ScanLine size={17} />,
      title: 'Track',
      desc: 'Record your income and expenses as they happen.',
    },
    {
      n: '02',
      icon: <Gauge size={17} />,
      title: 'Plan',
      desc: 'Create budgets and savings goals that fit your student life.',
    },
    {
      n: '03',
      icon: <TrendingUp size={17} />,
      title: 'Understand',
      desc: 'Use reports and insights to make better financial decisions.',
    },
  ];

  return (
    <section id="how" className="relative scroll-mt-28 py-16 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Start managing your money in 3 simple steps"
          sub="No setup complexity. No bank connection. Just a clear picture of your finances."
        />

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.n} delay={index * 130} className="relative">
              <div className="flex items-start gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-purple-400/40 bg-[#120C1F] text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] md:h-[56px] md:w-[56px]">
                  {step.icon}
                </div>
                <div className="md:mt-6">
                  <p className="text-[11px] font-semibold tracking-[0.3em] text-purple-400">
                    {step.n}
                  </p>
                  <h3 className="mt-1.5 text-[17px] font-semibold text-white md:mt-2">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-[13.5px] leading-[1.7] text-slate-400 md:mx-auto md:mt-2">
                    {step.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection() {
  const insights = [
    { icon: <Utensils size={16} />, text: 'Your food spending increased this month.' },
    { icon: <Gauge size={16} />, text: "You're 82% within your monthly budget." },
    { icon: <Target size={16} />, text: 'You are on track to reach your savings goal.' },
    { icon: <Bus size={16} />, text: 'You spent less on transport this month.' },
  ];

  return (
    <section
      id="insights"
      className="relative scroll-mt-28 border-y border-white/[0.06] bg-[#0A0614] py-16 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Financial insights"
          title="Understand your spending. Improve your habits."
          sub="Plain-language summaries surface what changed since last month."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {insights.map((insight, index) => (
            <Reveal key={insight.text} delay={index * 90}>
              <div
                className={`${CARD} flex items-start gap-4 p-4 transition-all duration-300 hover:border-purple-400/30 sm:p-5 sm:p-6`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/25 bg-purple-400/10 text-purple-300">
                  {insight.icon}
                </span>
                <p className="mt-1 text-[13.5px] leading-[1.65] text-slate-200">{insight.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`${CARD} overflow-hidden`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left sm:px-6 sm:py-5 ${FOCUS_RING}`}
      >
        <span className="text-[14px] font-medium text-slate-100 sm:text-[14.5px]">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-purple-300' : ''
          }`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[13px] leading-[1.7] text-slate-400 sm:px-6">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'What is Campus Coin?',
      a: 'Campus Coin is a student-first personal finance platform for tracking income and expenses, managing budgets, setting savings goals and understanding spending habits.',
    },
    {
      q: 'Who can use Campus Coin?',
      a: 'Any student who wants a simple way to manage allowance, part-time income and everyday expenses.',
    },
    {
      q: 'Can I track both income and expenses?',
      a: 'Yes. Record income from allowance, jobs, scholarships or gifts, and expenses across any category you choose.',
    },
    {
      q: 'Can I create monthly budgets?',
      a: 'Yes. Set spending limits per category and get notified as you approach them.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative scroll-mt-28 py-16 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[820px] px-5 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delay={(index % 5) * 60}>
              <FAQItem
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(current => (current === index ? -1 : index))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_circle_at_50%_35%,rgba(168,85,247,0.22),transparent_66%)] blur-2xl" />

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className={`${CARD} relative overflow-hidden border-purple-500/30 p-6 text-center sm:p-12 lg:p-16`}>
            <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
            <h2 className="mx-auto max-w-2xl text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-white sm:text-[2.4rem] lg:text-[2.6rem]">
              Take control of your money today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-[1.7] text-slate-400 sm:mt-5 sm:text-[15px]">
              The complete automated system designed to capture savings and grow your
              budget.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-5">
              <CtaLink
                to="/register"
                variant="primary"
                className="w-full px-8 py-4 text-[15px] sm:w-auto"
              >
                Get Started
              </CtaLink>
              <CtaLink
                to="/login"
                variant="secondary"
                className="w-full px-7 py-4 text-[15px] sm:w-auto"
              >
                User Login
              </CtaLink>
              <CtaLink
                to="/admin/login"
                variant="ghost"
                className="w-full px-7 py-4 text-[15px] sm:w-auto"
              >
                <ShieldAlert size={16} className="text-purple-400" />
                Admin Login
              </CtaLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = e => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToSection = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#07040E] text-slate-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="mx-auto max-w-[1180px] px-5 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-white">
                Campus <span className="text-purple-400">Coin</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[13.5px] leading-[1.7] text-slate-400">
              Campus Coin is an intuitive personal finance solution crafted specifically for
              students to manage budgets, track daily spending, and achieve long-term savings
              goals.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: <Twitter size={16} />, href: 'https://twitter.com' },
                { icon: <Github size={16} />, href: 'https://github.com' },
                { icon: <Linkedin size={16} />, href: 'https://linkedin.com' },
                { icon: <Instagram size={16} />, href: 'https://instagram.com' },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Social link"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white ${FOCUS_RING}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {NAV_LINKS.map(link => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className={`cursor-pointer text-slate-400 transition-colors hover:text-purple-300 ${FOCUS_RING}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white">
              Portals
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li>
                <Link
                  to="/login"
                  className={`text-slate-400 transition-colors hover:text-purple-300 ${FOCUS_RING}`}
                >
                  Student Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`text-slate-400 transition-colors hover:text-purple-300 ${FOCUS_RING}`}
                >
                  Create Student Account
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className={`inline-flex items-center gap-1.5 font-medium text-purple-400 transition-colors hover:text-purple-300 ${FOCUS_RING}`}
                >
                  <ShieldAlert size={14} />
                  Admin Control Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white">
              Stay Updated
            </h4>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
              Subscribe to get financial tips and project updates directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#120C1F] px-4 py-2.5 text-[13px] text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className={`absolute right-1.5 top-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-purple-600 text-white transition-all hover:bg-purple-500 ${FOCUS_RING}`}
                >
                  <Send size={13} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-medium text-emerald-400">
                  Subscribed successfully!
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-[12px] text-slate-500">© 2026 Campus Coin. All rights reserved.</p>

          <div className="flex flex-col items-center gap-4 text-[12px] text-slate-400 sm:flex-row sm:gap-6">
            <Link
              to="/privacy"
              className={`transition-colors hover:text-white ${FOCUS_RING}`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={`transition-colors hover:text-white ${FOCUS_RING}`}
            >
              Terms of Service
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#070510] font-sans text-slate-100 antialiased selection:bg-purple-500/30 selection:text-white">
      <WelcomeModal />

      <style>{`
        @keyframes ccMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cc-menu-in { animation: ccMenuIn 240ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .cc-menu-in { animation: none !important; }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#070510]" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_50%_15%,rgba(139,92,246,0.22),transparent_60%),radial-gradient(800px_circle_at_80%_80%,rgba(99,102,241,0.12),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <ProblemSection />
          <FeaturesSection />
          <DashboardShowcase />
          <HowItWorks />
          <InsightsSection />
          <FAQSection />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
