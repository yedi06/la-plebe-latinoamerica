'use client';

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionProps,
  type Variants,
} from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ==========================================================================
   Curvas de easing del sistema. Una sola "voz" de movimiento en las 3 propuestas.
   ========================================================================== */
export const EASE = [0.22, 1, 0.36, 1] as const; // expo-out suave
export const SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 } as const;

/* ==========================================================================
   Reveal — entrada al hacer scroll (fade + slide). Base de toda la landing.
   ========================================================================== */
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'footer';
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  x = 0,
  blur = true,
  once = true,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  if (reduce) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, filter: blur ? 'blur(10px)' : 'none' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-12% 0px -10% 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/* ==========================================================================
   Stagger — contenedor + item para revelados escalonados (propuesta 1)
   ========================================================================== */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

export function StaggerGroup({
  children,
  className,
  amount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & MotionProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem} {...rest}>
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   TiltCard — leve inclinación 3D + brillo que sigue al puntero.
   Se desactiva en táctil y con prefers-reduced-motion.
   ========================================================================== */
export function TiltCard({
  children,
  className = '',
  max = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 260, damping: 26 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 260, damping: 26 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={`preserve-3d relative ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch') return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      whileHover={{ scale: 1.014 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--gx)_var(--gy),rgba(255,255,255,.22),transparent_62%)] group-hover:opacity-100"
          style={{ ['--gx' as string]: gx, ['--gy' as string]: gy }}
        />
      )}
    </motion.div>
  );
}

/* ==========================================================================
   CountUp — anima el número al entrar en pantalla (stats de impacto)
   ========================================================================== */
export function CountUp({
  to,
  decimals = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
  className,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [val, setVal] = useState(0);
  const start = useRef<number | null>(null);
  const done = useRef(false);

  useAnimationFrame((t) => {
    if (!inView || done.current) return;
    if (reduce) {
      setVal(to);
      done.current = true;
      return;
    }
    if (start.current === null) start.current = t;
    const p = Math.min(1, (t - start.current) / (duration * 1000));
    // easeOutExpo: arranca rápido y frena — se lee como un contador "en vivo"
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    setVal(to * eased);
    if (p === 1) done.current = true;
  });

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {prefix}
      {val.toLocaleString('es-PE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   MeshBackground — blobs de marca animados + malla técnica. Capa decorativa.
   ========================================================================== */
export function MeshBackground({
  variant = 'dark',
  grid = true,
  className = '',
}: {
  variant?: 'dark' | 'light';
  grid?: boolean;
  className?: string;
}) {
  const turq = variant === 'dark' ? 'rgba(63,167,156,.34)' : 'rgba(63,167,156,.30)';
  const lima = variant === 'dark' ? 'rgba(139,197,63,.22)' : 'rgba(139,197,63,.26)';
  const navy = variant === 'dark' ? 'rgba(16,35,60,.85)' : 'rgba(16,35,60,.10)';

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {grid && <div className="absolute inset-0 tech-grid" />}
      <div
        className="absolute -left-[18%] -top-[22%] h-[62vh] w-[62vh] rounded-full blur-[90px] animate-blob-a will-change-transform"
        style={{ background: `radial-gradient(circle at 40% 40%, ${turq}, transparent 68%)` }}
      />
      <div
        className="absolute -right-[16%] top-[14%] h-[52vh] w-[52vh] rounded-full blur-[100px] animate-blob-b will-change-transform"
        style={{ background: `radial-gradient(circle at 60% 40%, ${lima}, transparent 68%)` }}
      />
      <div
        className="absolute bottom-[-20%] left-[22%] h-[56vh] w-[56vh] rounded-full blur-[110px] animate-blob-a will-change-transform"
        style={{
          animationDelay: '-8s',
          background: `radial-gradient(circle at 50% 50%, ${navy}, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ==========================================================================
   Marquee — cinta infinita (barra de aliados tipo Teletón)
   ========================================================================== */
export function Marquee({
  children,
  className = '',
  speed = 38,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div
      className={`group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className}`}
    >
      <div
        className="flex shrink-0 animate-marquee items-center gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/* ==========================================================================
   ScrollProgress — barra de progreso superior (sustituye visualmente al navbar)
   ========================================================================== */
export function ScrollProgress({ className = '' }: { className?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={`fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-turq via-lime to-turq ${className}`}
      style={{ transform: `scaleX(${p})`, transition: 'transform .12s linear' }}
    />
  );
}
