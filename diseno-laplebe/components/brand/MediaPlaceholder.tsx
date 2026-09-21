'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '@/components/motion';

/**
 * Espacio reservado para foto / video / short que el cliente aún no entrega.
 *
 * Criterio: ocupa EXACTAMENTE la proporción y el tamaño final del medio real,
 * con una composición de marca de fondo. La indicación de qué va ahí es una
 * línea de texto discreta — sin etiquetas de color ni chips de estado.
 */

export type Ratio = '16/9' | '9/16' | '4/3' | '3/2' | '1/1' | '21/9' | '4/5';

const SPECS: Record<Ratio, string> = {
  '16/9': '1920 × 1080',
  '9/16': '1080 × 1920',
  '4/3': '1600 × 1200',
  '3/2': '1800 × 1200',
  '1/1': '1200 × 1200',
  '21/9': '2520 × 1080',
  '4/5': '1080 × 1350',
};

type Props = {
  label: string;
  ratio?: Ratio;
  tone?: 'dark' | 'light';
  className?: string;
  children?: ReactNode;
  /** Oculta la medida (miniaturas pequeñas). */
  compact?: boolean;
  rounded?: string;
  /** Ocupa todo el contenedor padre en vez de una proporción fija. */
  fill?: boolean;
  labelPlacement?: 'center' | 'bottom';
};

export function MediaPlaceholder({
  label,
  ratio = '16/9',
  tone = 'dark',
  className = '',
  children,
  compact = false,
  rounded = 'rounded-none',
  fill = false,
  labelPlacement = 'center',
}: Props) {
  const reduce = useReducedMotion();
  const dark = tone === 'dark';
  const abajo = labelPlacement === 'bottom';

  return (
    <div
      role="img"
      aria-label={`${label}. Proporción ${ratio.replace('/', ':')}, ${SPECS[ratio]} px.`}
      style={fill ? undefined : { aspectRatio: ratio.replace('/', ' / ') }}
      className={`relative isolate overflow-hidden ${
        fill ? 'absolute inset-0 h-full w-full' : 'w-full'
      } ${rounded} ${dark ? 'media-fill' : 'media-fill-light'} ${className}`}
    >
      {/* Trama diagonal muy fina */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${
            dark ? 'rgba(242,239,233,.05)' : 'rgba(10,10,10,.04)'
          } 0 1px, transparent 1px 12px)`,
        }}
      />

      {/* Barrido de luz lento */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${
              dark ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.55)'
            }, transparent)`,
          }}
          animate={{ x: ['0%', '460%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
      )}

      {/* Indicación del contenido: una sola línea, sin etiquetas ni iconos */}
      <div
        className={`absolute inset-0 z-10 flex flex-col px-5 text-center ${
          abajo ? 'justify-end pb-11' : fill ? 'justify-start pt-[24svh]' : 'justify-center'
        } items-center`}
      >
        <p
          className={`max-w-[34ch] text-pretty text-[12px] font-medium leading-snug sm:text-[13px] ${
            dark ? 'text-cream/70' : 'text-ink/60'
          }`}
        >
          {label}
        </p>
        {!compact && (
          <p
            className={`mt-1.5 text-[10px] tabular-nums tracking-wide ${
              dark ? 'text-cream/35' : 'text-ink/35'
            }`}
          >
            {ratio.replace('/', ':')} · {SPECS[ratio]} px
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

/** Variante 9:16 con reproducción al pasar el puntero — grilla de TikTok. */
export function ShortPlaceholder({
  label,
  index,
  className = '',
}: {
  label: string;
  index: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={`group relative ${className}`}
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <MediaPlaceholder
        label={label}
        ratio="9/16"
        tone="dark"
        compact
        labelPlacement="bottom"
        rounded="rounded-sm"
      >
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 text-cream/80 transition-all duration-300 group-hover:scale-110 group-hover:border-cream/60 group-hover:text-cream">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
              <path d="M8 5.2 19 12 8 18.8z" />
            </svg>
          </span>
        </div>
        <p className="absolute inset-x-0 bottom-0 z-20 p-3 text-[10.5px] text-cream/55">
          @la.plebe_latinoamerica
        </p>
      </MediaPlaceholder>
    </motion.article>
  );
}
