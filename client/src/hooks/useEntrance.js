import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export function useEntrance(deps = []) { const ref = useRef(null); useEffect(() => { if (!ref.current) return; const ctx = gsap.context(() => gsap.fromTo('[data-enter]', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .06, ease: 'power2.out' }), ref); return () => ctx.revert(); }, deps); return ref; }
