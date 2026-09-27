import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as THREE from 'three';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { notifyError, notifySuccess } from '../utils/swal.js';
import { Logo } from '../components/common/Logo.jsx';

const BG = '#050a12';
const CARD_BG = 'rgba(15, 23, 42, 0.78)';
const CARD_BORDER = 'rgba(56, 189, 248, 0.18)';
const GRAD = 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

const MailIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const UserIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
);

const EyeIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.9" />
    <path d="M6.6 6.6C3.7 8.6 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.4-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

const ArrowRightIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const ChevronDownIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const AlertIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6" />
    <path d="M12 16.5v.5" />
  </svg>
);

const CheckIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>
);

const ShieldIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
  </svg>
);

const DatabaseIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <ellipse cx="12" cy="5.5" rx="8" ry="3" />
    <path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    <path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);

const UnlinkIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} className={className} {...stroke}>
    <path d="M9 15 15 9" />
    <path d="M11 6.5 12.5 5a4 4 0 0 1 5.7 5.7L16.5 12" />
    <path d="M13 17.5 11.5 19a4 4 0 0 1-5.7-5.7L7.5 12" />
  </svg>
);

const GoogleMark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

function AuthScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 35);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x94a3b8, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(10, 15, 15);
    scene.add(key);
    const cyan = new THREE.PointLight(0x06b6d4, 100, 100, 2);
    cyan.position.set(-15, 8, 10);
    scene.add(cyan);
    const blue = new THREE.PointLight(0x3b82f6, 80, 100, 2);
    blue.position.set(15, -5, -10);
    scene.add(blue);

    const root = new THREE.Group();
    scene.add(root);

    const wireframeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(14, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      })
    );
    root.add(wireframeSphere);

    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0a1120,
        transparent: true,
        opacity: 0.9,
      })
    );
    root.add(innerSphere);

    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(10.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.08,
      })
    );
    root.add(glowSphere);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(20, 0.1, 16, 160),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.8,
      })
    );
    ring1.rotation.x = 1.2;
    ring1.rotation.z = 0.4;
    root.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(24, 0.08, 16, 160),
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.5,
      })
    );
    ring2.rotation.x = 1.5;
    ring2.rotation.y = 0.6;
    root.add(ring2);

    const dotPositions = [
      { x: -8, y: 6, z: 10 },
      { x: 10, y: -8, z: 8 },
      { x: 2, y: 12, z: -5 },
    ];

    dotPositions.forEach(pos => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
        })
      );
      dot.position.set(pos.x, pos.y, pos.z);
      root.add(dot);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity: 0.2,
        })
      );
      halo.position.copy(dot.position);
      root.add(halo);
    });

    const dustCount = 300;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPos[i * 3] = (Math.random() - 0.5) * 80;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0x67e8f9,
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(dust);

    let px = 0;
    let py = 0;
    const onPointer = e => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer);

    const start = performance.now();
    let frame = 0;
    const animate = () => {
      const t = (performance.now() - start) / 1000;
      if (!reduce) {
        root.rotation.y = t * 0.12;
        wireframeSphere.rotation.y = -t * 0.06;
        innerSphere.rotation.y = t * 0.04;
        glowSphere.rotation.y = t * 0.04;
        ring1.rotation.z = t * 0.1;
        ring2.rotation.z = -t * 0.08;
        dust.rotation.y = t * 0.01;
      }
      camera.position.x += (px * 2.5 - camera.position.x) * 0.04;
      camera.position.y += (0.4 - py * 1.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount.clientWidth) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}

const errorCls = 'mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-400';

const fieldWrap = focused => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  border: `1px solid ${focused ? 'rgba(34,211,238,0.85)' : 'rgba(56,189,248,0.25)'}`,
  borderRadius: 14,
  padding: '0 16px',
  background: 'rgba(15,23,42,0.65)',
  transition: 'border-color .2s, box-shadow .2s',
  boxShadow: focused ? '0 0 0 3px rgba(34,211,238,0.14)' : 'none',
  width: '100%',
});

const fieldWrapError = {
  ...fieldWrap(false),
  border: '1px solid rgba(251,113,133,0.7)',
};

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: '0',
  outline: 'none',
  color: '#f1f5f9',
  fontSize: 15,
  padding: '24px 0 8px',
  boxShadow: 'none',
};

function FloatField({ id, label, icon, error, right, value, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value !== undefined && value !== null && value !== '');
  const labelStyle = {
    position: 'absolute',
    left: icon ? 42 : 16,
    top: active ? 8 : 19,
    fontSize: active ? 10 : 14,
    fontWeight: active ? 700 : 500,
    letterSpacing: active ? '0.09em' : '0',
    textTransform: active ? 'uppercase' : 'none',
    color: error ? '#fda4af' : focused ? '#67e8f9' : '#7c8aa5',
    pointerEvents: 'none',
    transition: 'all .18s ease',
  };
  return (
    <div className="w-full">
      <div style={error ? fieldWrapError : fieldWrap(focused)}>
        {icon && (
          <span style={{ color: focused ? '#67e8f9' : '#64748b', flexShrink: 0, display: 'inline-flex' }}>
            {icon}
          </span>
        )}
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
        <input
          id={id}
          value={value}
          style={inputStyle}
          onFocus={e => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          {...inputProps}
        />
        {right}
      </div>
      {error && (
        <span className={errorCls}>
          <AlertIcon size={12} />
          {error}
        </span>
      )}
    </div>
  );
}

function YearSelect({ id, label, name, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <span
        id={`${id}-label`}
        style={{
          display: 'block',
          marginBottom: 8,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#7c8aa5',
        }}
      >
        {label}
      </span>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '14px 16px',
          borderRadius: 14,
          border: `1px solid ${open ? 'rgba(34,211,238,0.85)' : 'rgba(56,189,248,0.25)'}`,
          background: 'rgba(15,23,42,0.65)',
          color: value ? '#f1f5f9' : '#7c8aa5',
          fontSize: 14,
          fontWeight: 600,
          textAlign: 'left',
          cursor: 'pointer',
          boxShadow: open ? '0 0 0 3px rgba(34,211,238,0.14)' : 'none',
          transition: 'border-color .2s, box-shadow .2s',
        }}
      >
        {value || 'Select year'}
        <ChevronDownIcon
          size={16}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s', color: '#67e8f9' }}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 100,
            margin: 0,
            padding: 4,
            listStyle: 'none',
            maxHeight: 208,
            overflowY: 'auto',
            borderRadius: 12,
            border: '1px solid rgba(34,211,238,0.3)',
            background: '#0a1526',
            boxShadow: '0 24px 60px -18px rgba(2,6,23,0.95)',
          }}
        >
          {YEAR_OPTIONS.map(opt => (
            <li key={opt} role="option" aria-selected={opt === value}>
              <button
                type="button"
                onClick={() => {
                  onChange({ target: { name, value: opt } });
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  minHeight: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: '0',
                  background: opt === value ? 'rgba(34,211,238,0.14)' : 'transparent',
                  color: opt === value ? '#67e8f9' : '#cbd5e1',
                  fontSize: 13,
                  fontWeight: opt === value ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {opt}
                {opt === value && <CheckIcon size={13} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const passwordRequirements = pw => [
  { label: 'At least 8 characters', met: pw.length >= 8 },
  { label: 'One uppercase letter', met: /[A-Z]/.test(pw) },
  { label: 'One number', met: /\d/.test(pw) },
  { label: 'One special character', met: /[^A-Za-z0-9]/.test(pw) },
];

function PasswordField({
  id,
  label,
  error,
  showStrength,
  strength,
  showRequirements,
  onToggle,
  shown,
  value,
  ...inputProps
}) {
  return (
    <div className="w-full">
      <FloatField
        id={id}
        label={label}
        icon={<LockIcon size={15} />}
        error={error}
        type={shown ? 'text' : 'password'}
        value={value}
        right={
          <button
            type="button"
            tabIndex={-1}
            onClick={onToggle}
            aria-label={shown ? 'Hide password' : 'Show password'}
            style={{
              width: 'auto',
              height: 'auto',
              minWidth: 0,
              minHeight: 0,
              padding: 0,
              border: '0',
              borderRadius: 0,
              background: 'transparent',
              boxShadow: 'none',
              backdropFilter: 'none',
              display: 'inline-flex',
              color: shown ? '#67e8f9' : '#64748b',
              cursor: 'pointer',
            }}
          >
            {shown ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        }
        {...inputProps}
      />
      {showStrength && value && (
        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="flex flex-1 gap-1.5">
            {[1, 2, 3, 4].map(i => (
              <span
                key={i}
                className={
                  i <= strength
                    ? ['bg-rose-500', 'bg-amber-400', 'bg-teal-400', 'bg-emerald-400'][strength - 1]
                    : 'bg-white/10'
                }
                style={{ height: 3, flex: 1, borderRadius: 999 }}
              />
            ))}
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              ['text-rose-400', 'text-amber-300', 'text-teal-300', 'text-emerald-300'][strength - 1]
            }`}
          >
            {['Weak', 'Fair', 'Good', 'Strong'][strength - 1]}
          </span>
        </div>
      )}
      {showRequirements && (
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 md:grid-cols-4">
          {passwordRequirements(value || '').map(r => (
            <li
              key={r.label}
              className="flex items-center gap-1.5 text-[10.5px]"
              style={{ color: r.met ? '#5eead4' : '#64748b' }}
            >
              <span style={{ display: 'inline-flex' }}>
                {r.met ? (
                  <CheckIcon size={12} />
                ) : (
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      border: '1px solid currentColor',
                      display: 'inline-block',
                    }}
                  />
                )}
              </span>
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function usePasswordToggle() {
  const [shown, setShown] = useState({});
  return {
    shown,
    toggle: id => setShown(prev => ({ ...prev, [id]: !prev[id] })),
  };
}

function PrimaryButton({ children, disabled, type = 'submit', onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        minHeight: 0,
        padding: '15px 22px',
        border: '0',
        borderRadius: 13,
        background: GRAD,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        boxShadow: '0 12px 32px -14px rgba(14,165,233,0.65)',
        backdropFilter: 'none',
        filter: hover && !disabled ? 'brightness(1.1)' : 'none',
        transform: hover && !disabled ? 'translateY(-1px)' : 'none',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'filter .18s, transform .18s',
      }}
    >
      {children}
    </button>
  );
}

function Alert({ tone, children }) {
  return (
    <div
      role={tone === 'ok' ? 'status' : 'alert'}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs leading-relaxed ${
        tone === 'ok'
          ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
          : 'border-rose-400/25 bg-rose-400/10 text-rose-300'
      }`}
    >
      {tone === 'ok' ? (
        <CheckIcon size={14} className="mt-0.5 shrink-0" />
      ) : (
        <AlertIcon size={14} className="mt-0.5 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const trustItems = [
  { icon: <ShieldIcon size={13} />, label: 'Secure Authentication' },
  { icon: <DatabaseIcon size={13} />, label: 'Private Financial Data' },
  { icon: <UnlinkIcon size={13} />, label: 'No Bank Connection' },
];

function TrustRow() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 border-t pt-5 sm:flex-row sm:justify-center sm:gap-x-6" style={{ borderColor: 'rgba(148,163,184,0.12)' }}>
      {trustItems.map(t => (
        <span key={t.label} className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500">
          <span style={{ color: '#22d3ee', display: 'inline-flex' }}>{t.icon}</span>
          {t.label}
        </span>
      ))}
    </div>
  );
}

function GoogleButton({ onCredential, disabled = false }) {
  const wrapRef = useRef(null);
  const gsiRef = useRef(null);
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;

  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState('loading');
  const [hint, setHint] = useState('');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () => {
      const next = Math.max(200, Math.min(440, Math.floor(el.offsetWidth || 0)));
      setWidth(prev => (Math.abs(prev - next) >= 10 ? next : prev));
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setStatus('unavailable');
      setHint('Google sign-in unlocks once VITE_GOOGLE_CLIENT_ID is configured.');
      return undefined;
    }

    let cancelled = false;
    const render = () => {
      if (cancelled) return;
      if (!window.google?.accounts?.id || !gsiRef.current) {
        setStatus('unavailable');
        setHint('Google sign-in could not be loaded right now.');
        return;
      }
      gsiRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => cbRef.current?.(credential),
      });
      window.google.accounts.id.renderButton(gsiRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: width || 320,
      });
      setStatus('ready');
      setHint('');
    };

    if (window.google?.accounts?.id) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector('script[data-gsi="true"]');
    if (existing) {
      existing.addEventListener('load', render);
      return () => {
        cancelled = true;
        existing.removeEventListener('load', render);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.gsi = 'true';
    script.onload = render;
    script.onerror = () => {
      setStatus('unavailable');
      setHint('Google sign-in could not be loaded right now.');
    };
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [width]);

  const ready = status === 'ready' && !disabled;

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        aria-hidden="true"
        className={`flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-semibold text-slate-900 transition ${
          ready ? 'hover:bg-slate-100' : 'opacity-60'
        }`}
      >
        <GoogleMark />
        Continue with Google
      </div>
      <div
        ref={gsiRef}
        aria-hidden={!ready}
        className={`absolute inset-0 overflow-hidden rounded-xl [&>div]:!h-full [&>div]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full ${
          ready ? 'opacity-0' : 'pointer-events-none opacity-0'
        }`}
      />
      {hint && <p className="mt-2 text-center text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

const headerLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  borderRadius: 999,
  border: '1px solid rgba(56,189,248,0.22)',
  padding: '8px 14px',
  fontSize: 11,
  fontWeight: 600,
  color: '#cbd5e1',
  background: 'rgba(15,23,42,0.55)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const inlineLinkStyle = {
  color: '#67e8f9',
  fontWeight: 600,
  textDecoration: 'none',
  background: 'transparent',
};

function AuthLayout({ headerRight, children, wide = false }) {
  return (
    <div
      className="relative flex min-h-dvh w-full overflow-x-hidden text-slate-100"
      style={{ background: BG }}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <AuthScene />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(900px circle at 85% 8%, rgba(34,211,238,0.12), transparent 60%), radial-gradient(760px circle at 8% 92%, rgba(37,99,235,0.16), transparent 62%)',
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
        }}
      />

      <div className="relative z-10 flex min-h-dvh w-full flex-col">
        <header className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-6">
          <Link to="/" className="flex items-center gap-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white sm:text-sm">
            <ArrowRightIcon size={14} className="rotate-180" />
            Back to Home
          </Link>
          {headerRight}
        </header>

        <main className="flex w-full flex-1 items-center justify-center px-4 py-24 sm:px-6">
          <section className={`w-full ${wide ? 'max-w-[760px]' : 'max-w-[520px]'}`}>{children}</section>
        </main>
      </div>
    </div>
  );
}

function AuthCard({ children }) {
  return (
    <div
      className="relative w-full rounded-3xl p-5 sm:p-8"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        backdropFilter: 'blur(24px)',
        boxShadow: '0 40px 120px -50px rgba(34,211,238,0.3)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-12 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.7), transparent)' }}
      />
      {children}
    </div>
  );
}

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const scorePassword = pw => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(Math.max(score, 1), 4);
};

const YEAR_OPTIONS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate', 'Other'];

const REMEMBER_KEY = 'cc_remember_email';

export function AuthPage({ mode, adminOnly = false }) {
  const isLogin = mode === 'login';
  const nav = useNavigate();
  const { setUser } = useAuth();
  const { shown, toggle } = usePasswordToggle();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicYear: '',
    monthlyAllowance: '',
    savingsGoal: '',
  });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isLogin && !adminOnly) {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setForm(prev => ({ ...prev, email: saved }));
        setRemember(true);
      }
    }
  }, [isLogin, adminOnly]);

  const validateField = (name, value, currentForm = form) => {
    let err = '';
    if (name === 'name' && !isLogin) {
      if (!value.trim()) err = 'Full name is required.';
      else if (value.trim().length < 2) err = 'Name must be at least 2 characters.';
    }
    if (name === 'email') {
      if (!value.trim()) err = adminOnly ? 'Administrator email is required.' : 'Please enter your email address.';
      else if (!validateEmail(value.trim())) err = 'Please enter a valid email address.';
    }
    if (name === 'password') {
      if (!value) err = 'Password is required.';
      else if (value.length < 8) err = 'Password must be at least 8 characters long.';
    }
    if (name === 'confirmPassword' && !isLogin) {
      if (!value) err = 'Please confirm your password.';
      else if (value !== currentForm.password) err = 'Passwords do not match.';
    }
    if (name === 'monthlyAllowance' && value !== '' && Number(value) < 0) {
      err = 'Allowance cannot be negative.';
    }
    if (name === 'savingsGoal' && value !== '' && Number(value) < 0) {
      err = 'Savings goal cannot be negative.';
    }
    return err;
  };

  const update = event => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value, nextForm) }));
    }
    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', nextForm.confirmPassword, nextForm),
      }));
    }
  };

  const handleBlur = event => {
    const { name, value } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const done = (data, msg) => {
    if (isLogin && !adminOnly) {
      if (remember) localStorage.setItem(REMEMBER_KEY, form.email);
      else localStorage.removeItem(REMEMBER_KEY);
    }
    setUser(data.user);
    notifySuccess(
      msg ||
        (adminOnly ? 'Administrator access granted' : isLogin ? 'Welcome Back!' : 'Account Created!'),
      `Signed in as ${data.user.name || data.user.email}`
    );
    nav(data.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  const submit = async event => {
    event.preventDefault();
    setServerError('');

    const fields = isLogin
      ? ['email', 'password']
      : ['name', 'email', 'password', 'confirmPassword', 'monthlyAllowance', 'savingsGoal'];

    const nextErrors = {};
    let hasError = false;
    fields.forEach(key => {
      const err = validateField(key, form[key]);
      if (err) {
        nextErrors[key] = err;
        hasError = true;
      }
    });
    setErrors(nextErrors);
    setTouched(fields.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (hasError) {
      notifyError('Validation Error', 'Please check the highlighted fields below.');
      return;
    }

    setBusy(true);
    try {
      const endpoint = isLogin ? (adminOnly ? '/auth/admin/login' : '/auth/login') : '/auth/register';
      const res = await api.post(endpoint, form);
      done(
        res,
        adminOnly ? 'Administrator Login Successful' : isLogin ? 'Login Successful' : 'Registration Successful'
      );
    } catch (err) {
      setServerError(err.message);
      notifyError(isLogin ? 'Login Failed' : 'Registration Failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  const google = async credential => {
    setBusy(true);
    setServerError('');
    try {
      const res = await api.post('/auth/google', { credential });
      done(res, 'Google Sign-In Successful');
    } catch (err) {
      setServerError(err.message);
      notifyError('Google Sign-In Failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  const heading = adminOnly
    ? 'Administrator Access'
    : isLogin
      ? 'Welcome back'
      : 'Create your Campus Coin account';

  const subtitle = adminOnly
    ? 'Authorized Campus Coin administrators only.'
    : isLogin
      ? 'Sign in to continue managing your finances.'
      : 'Start building smarter money habits today.';

  const headerRight = adminOnly ? (
    <Link to="/" style={headerLinkStyle}>
      <ArrowRightIcon size={12} className="rotate-180" />
      Back to Campus Coin
    </Link>
  ) : isLogin ? (
    <Link to="/register" style={headerLinkStyle}>
      New here? Register
    </Link>
  ) : (
    <Link to="/login" style={headerLinkStyle}>
      Already have an account? Login
    </Link>
  );

  const isWide = !isLogin && !adminOnly;

  return (
    <AuthLayout headerRight={headerRight} wide={isWide}>
      <AuthCard>
        <div className="mb-6 flex justify-center">
          <Logo height={44} className="text-white" />
        </div>

        {adminOnly && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-cyan-200">
            <ShieldIcon size={12} />
            Protected administrative access
          </div>
        )}

        <h2 className="text-[22px] font-extrabold tracking-tight text-white sm:text-[25px]">{heading}</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{subtitle}</p>

        <form
          onSubmit={submit}
          className={`mt-6 gap-x-5 gap-y-5 ${
            isLogin || adminOnly ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2'
          }`}
          noValidate
        >
          {!isLogin && !adminOnly && (
            <FloatField
              id="auth-name"
              label="Full name"
              icon={<UserIcon size={15} />}
              name="name"
              value={form.name}
              onChange={update}
              onBlur={handleBlur}
              placeholder=" "
              autoComplete="name"
              error={errors.name}
            />
          )}

          <FloatField
            id="auth-email"
            label={adminOnly ? 'Admin email' : 'Email address'}
            icon={<MailIcon size={15} />}
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            onBlur={handleBlur}
            placeholder=" "
            autoComplete="email"
            error={errors.email}
          />

          <div className={isLogin || adminOnly ? 'contents' : 'sm:col-span-2'}>
            <PasswordField
              id="auth-password"
              label={isLogin ? 'Password' : 'Create a strong password'}
              name="password"
              value={form.password}
              onChange={update}
              onBlur={handleBlur}
              placeholder=" "
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              error={errors.password}
              shown={!!shown.password}
              onToggle={() => toggle('password')}
              showStrength={!isLogin}
              showRequirements={!isLogin}
              strength={scorePassword(form.password)}
            />
          </div>

          {!isLogin && !adminOnly && (
            <>
              <PasswordField
                id="auth-confirm"
                label="Confirm password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={update}
                onBlur={handleBlur}
                placeholder=" "
                autoComplete="new-password"
                error={errors.confirmPassword}
                shown={!!shown.confirmPassword}
                onToggle={() => toggle('confirmPassword')}
              />

              <YearSelect
                id="auth-year"
                label="Academic year"
                name="academicYear"
                value={form.academicYear}
                onChange={update}
              />

              <div className="sm:col-span-2">
                <FloatField
                  id="auth-goal"
                  label="Monthly savings goal"
                  type="number"
                  min="0"
                  name="savingsGoal"
                  value={form.savingsGoal}
                  onChange={update}
                  onBlur={handleBlur}
                  placeholder=" "
                  error={errors.savingsGoal}
                />
              </div>
            </>
          )}

          {isLogin && !adminOnly && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: '#22d3ee', width: 15, height: 15 }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={inlineLinkStyle} className="text-xs">
                Forgot password?
              </Link>
            </div>
          )}

          {serverError && <Alert tone="err">{serverError}</Alert>}

          <PrimaryButton disabled={busy}>
            {busy ? (
              <>
                <Spinner />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {adminOnly ? 'Admin Sign In' : isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRightIcon size={16} />
              </>
            )}
          </PrimaryButton>
        </form>

        {!adminOnly && (
          <>
            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <GoogleButton onCredential={google} disabled={busy} />
            <p className="mt-4 text-center text-xs text-slate-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link to={isLogin ? '/register' : '/login'} style={inlineLinkStyle}>
                {isLogin ? 'Create account' : 'Sign in'}
              </Link>
            </p>
          </>
        )}

        <TrustRow />
      </AuthCard>
    </AuthLayout>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const check = value => {
    if (!value.trim()) return 'Please enter your email address.';
    if (!validateEmail(value.trim())) return 'Please enter a valid email address.';
    return '';
  };

  const submit = async event => {
    event.preventDefault();
    setServerError('');
    setTouched(true);
    const err = check(email);
    if (err) {
      setError(err);
      return;
    }
    setBusy(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.message);
      notifySuccess('Reset Link Sent', 'If an eligible account exists, a link has been emailed.');
    } catch (err) {
      setServerError(err.message);
      notifyError('Request Failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      headerRight={
        <Link to="/login" style={headerLinkStyle}>
          <ArrowRightIcon size={12} className="rotate-180" />
          Back to Login
        </Link>
      }
    >
      <AuthCard>
        <div className="mb-6 flex justify-center">
          <Logo height={44} className="text-white" />
        </div>
        <h2 className="text-[25px] font-extrabold tracking-tight text-white sm:text-[28px]">Forgot your password?</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
          No worries. Enter your email and we’ll help you get back into your account.
        </p>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-[18px]" noValidate>
          <FloatField
            id="reset-email"
            label="Email address"
            icon={<MailIcon size={15} />}
            type="email"
            value={email}
            onChange={event => {
              setEmail(event.target.value);
              if (touched) setError(check(event.target.value));
            }}
            onBlur={() => {
              setTouched(true);
              setError(check(email));
            }}
            placeholder=" "
            autoComplete="email"
            error={touched ? error : ''}
          />

          {message && <Alert tone="ok">{message}</Alert>}
          {serverError && <Alert tone="err">{serverError}</Alert>}

          <PrimaryButton disabled={busy}>
            {busy ? (
              <>
                <Spinner />
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRightIcon size={16} />
              </>
            )}
          </PrimaryButton>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          <Link to="/login" style={inlineLinkStyle}>
            ← Back to Login
          </Link>
        </p>
        <TrustRow />
      </AuthCard>
    </AuthLayout>
  );
}

export function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const { shown, toggle } = usePasswordToggle();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (field, value, nextForm = form) => {
    let err = '';
    if (field === 'password') {
      if (!value) err = 'New password is required.';
      else if (value.length < 8) err = 'Password must be at least 8 characters long.';
    }
    if (field === 'confirmPassword') {
      if (!value) err = 'Please confirm your new password.';
      else if (value !== nextForm.password) err = 'Passwords do not match.';
    }
    return err;
  };

  const update = event => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value, nextForm) }));
    }
    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validate('confirmPassword', nextForm.confirmPassword, nextForm),
      }));
    }
  };

  const submit = async event => {
    event.preventDefault();
    setServerError('');

    const passwordError = validate('password', form.password);
    const confirmError = validate('confirmPassword', form.confirmPassword);
    setErrors({ password: passwordError, confirmPassword: confirmError });
    setTouched({ password: true, confirmPassword: true });

    if (passwordError || confirmError) {
      notifyError('Validation Error', 'Please check the highlighted password fields.');
      return;
    }

    setBusy(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
      notifySuccess('Password Updated', 'You can now sign in with your new password.');
    } catch (err) {
      setServerError(err.message);
      notifyError('Reset Failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      headerRight={
        <Link to="/login" style={headerLinkStyle}>
          <ArrowRightIcon size={12} className="rotate-180" />
          Back to Login
        </Link>
      }
    >
      <AuthCard>
        {success ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <CheckIcon size={30} />
            </div>
            <h2 className="text-[23px] font-extrabold tracking-tight text-white">Password updated successfully</h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-slate-400">
              You can now sign in with your new password.
            </p>
            <div className="mt-7 w-full">
              <PrimaryButton type="button" onClick={() => nav('/login', { replace: true })}>
                Go to Login
                <ArrowRightIcon size={16} />
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <Logo height={44} className="text-white" />
            </div>
            <h2 className="text-[25px] font-extrabold tracking-tight text-white sm:text-[28px]">Create a new password</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
              Choose a strong password for your Campus Coin account.
            </p>

            <form onSubmit={submit} className="mt-7 flex flex-col gap-[18px]" noValidate>
              <PasswordField
                id="new-pass"
                label="New password"
                name="password"
                value={form.password}
                onChange={update}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, password: true }));
                  setErrors(prev => ({ ...prev, password: validate('password', form.password) }));
                }}
                placeholder=" "
                autoComplete="new-password"
                error={errors.password}
                shown={!!shown.password}
                onToggle={() => toggle('password')}
                showStrength
                showRequirements
                strength={scorePassword(form.password)}
              />

              <PasswordField
                id="conf-pass"
                label="Confirm new password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={update}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, confirmPassword: true }));
                  setErrors(prev => ({
                    ...prev,
                    confirmPassword: validate('confirmPassword', form.confirmPassword),
                  }));
                }}
                placeholder=" "
                autoComplete="new-password"
                error={errors.confirmPassword}
                shown={!!shown.confirmPassword}
                onToggle={() => toggle('confirmPassword')}
              />

              {serverError && <Alert tone="err">{serverError}</Alert>}

              <PrimaryButton disabled={busy}>
                {busy ? (
                  <>
                    <Spinner />
                    Updating...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </PrimaryButton>
            </form>
            <TrustRow />
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}