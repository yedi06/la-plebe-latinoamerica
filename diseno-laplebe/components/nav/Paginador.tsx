'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { EASE } from '@/components/motion';

export type Pantalla = { id: string; titulo: string; contenido: ReactNode };

/**
 * Propuesta 01 — la rueda del mouse (o el swipe) salta de pantalla completa.
 * No hay scroll de página en ningún momento.
 */
export function Paginador({ pantallas }: { pantallas: Pantalla[] }) {
  const reduce = useReducedMotion();
  const [[indice, sentido], setEstado] = useState<[number, number]>([0, 1]);
  const total = pantallas.length;

  const ir = useCallback(
    (destino: number) => {
      const i = Math.max(0, Math.min(total - 1, destino));
      setEstado(([actual]) => (i === actual ? [actual, 0] : [i, i > actual ? 1 : -1]));
    },
    [total],
  );
  const siguiente = useCallback(() => setEstado(([a]) => [Math.min(total - 1, a + 1), 1]), [total]);
  const anterior = useCallback(() => setEstado(([a]) => [Math.max(0, a - 1), -1]), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        siguiente();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        anterior();
      } else if (e.key === 'Home') ir(0);
      else if (e.key === 'End') ir(total - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [siguiente, anterior, ir, total]);

  // Rueda / trackpad: un gesto = una pantalla
  useEffect(() => {
    let bloqueado = false;
    const onWheel = (e: WheelEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('[data-scroll-interno="si"]')) return;
      if (Math.abs(e.deltaY) < 22 || bloqueado) return;
      bloqueado = true;
      setTimeout(() => (bloqueado = false), 640);
      if (e.deltaY > 0) siguiente();
      else anterior();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [siguiente, anterior]);

  const variantes = {
    entra: (s: number) => ({ opacity: 0, x: s > 0 ? 60 : -60 }),
    centro: { opacity: 1, x: 0 },
    sale: (s: number) => ({ opacity: 0, x: s > 0 ? -60 : 60 }),
  };

  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden">
      {/* Índice superior: líneas finas con el nombre de cada pantalla */}
      <div className="relative z-30 flex shrink-0 gap-5 px-5 pt-5 sm:px-8">
        {pantallas.map((p, i) => (
          <button key={p.id} type="button" onClick={() => ir(i)} className="group flex-1 text-left">
            <span className="block h-px w-full bg-[rgb(var(--fg)/.18)]">
              <motion.span
                className="block h-px bg-[rgb(var(--fg))]"
                initial={false}
                animate={{ width: i === indice ? '100%' : '0%' }}
                transition={{ duration: 0.45, ease: EASE }}
              />
            </span>
            <span
              className={`mt-2 hidden text-[10.5px] transition-colors sm:block ${
                i === indice ? 'text-[rgb(var(--fg))]' : 'text-[rgb(var(--fg-muted))]'
              }`}
            >
              {p.titulo}
            </span>
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false} custom={sentido} mode="wait">
          <motion.section
            key={pantallas[indice].id}
            custom={sentido}
            variants={reduce ? undefined : variantes}
            initial="entra"
            animate="centro"
            exit="sale"
            transition={{ duration: 0.4, ease: EASE }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -420) siguiente();
              else if (info.offset.x > 70 || info.velocity.x > 420) anterior();
            }}
            aria-label={pantallas[indice].titulo}
            className="absolute inset-0 flex touch-pan-y flex-col"
          >
            <div
              data-scroll-interno="si"
              className="hide-scrollbar flex min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-24 pt-6 sm:px-8"
            >
              <div className="m-auto w-full max-w-[1080px]">{pantallas[indice].contenido}</div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Controles */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] sm:px-8">
        <span className="pointer-events-auto font-display text-[12px] tabular-nums text-[rgb(var(--fg-muted))]">
          {String(indice + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={anterior}
            disabled={indice === 0}
            aria-label="Pantalla anterior"
            className="flex h-11 w-11 items-center justify-center border border-[rgb(var(--line)/var(--line-a))] transition hover:border-[rgb(var(--fg)/.45)] disabled:opacity-25"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H6M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={siguiente}
            disabled={indice === total - 1}
            aria-label="Pantalla siguiente"
            className="flex h-11 w-11 items-center justify-center bg-[rgb(var(--fg))] text-[rgb(var(--bg))] transition hover:opacity-90 disabled:opacity-25"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
