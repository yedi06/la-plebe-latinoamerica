'use client';

import type { ReactNode } from 'react';

/**
 * Botón principal de la marca — el degradado turquesa → lima con la flecha.
 * Es el único botón "lleno" del sistema: si todo grita, nada grita.
 */
export function BotonPrincipal({
  children,
  bajada,
  onClick,
  href,
  icono,
  className = '',
  tamano = 'lg',
}: {
  children: ReactNode;
  /** Línea secundaria dentro del botón: texto o, por ejemplo, la fila de logos. */
  bajada?: ReactNode;
  onClick?: () => void;
  href?: string;
  icono?: ReactNode;
  className?: string;
  tamano?: 'lg' | 'md';
}) {
  const alto = tamano === 'lg' ? 'px-5 py-5 sm:px-6' : 'px-5 py-4';
  const titulo =
    tamano === 'lg'
      ? 'text-[clamp(1.25rem,5.5vw,1.7rem)]'
      : 'text-[clamp(1.05rem,4.5vw,1.3rem)]';

  const interior = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-turq via-lime to-turq bg-[length:220%_auto] motion-safe:animate-gradient-pan"
      />
      {icono && <span className="shrink-0 text-ink">{icono}</span>}
      <span className="min-w-0 flex-1 text-left">
        <span className={`block font-display uppercase leading-none tracking-tight text-ink ${titulo}`}>
          {children}
        </span>
        {bajada && <span className="mt-2 block text-[12px] leading-snug text-ink/70">{bajada}</span>}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 12h13M13 6l6 6-6 6" />
      </svg>
    </>
  );

  const base = `group relative isolate flex w-full items-center gap-4 overflow-hidden ${alto} transition active:scale-[.99] ${className}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {interior}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {interior}
    </button>
  );
}

/** Botón secundario: contorno fino, sin relleno. */
export function BotonSecundario({
  children,
  onClick,
  href,
  icono,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  icono?: ReactNode;
  className?: string;
}) {
  const base = `group inline-flex w-full items-center justify-center gap-2 border border-[rgb(var(--line)/var(--line-a))] px-5 py-3.5 font-display text-[15px] uppercase tracking-tight transition hover:border-[rgb(var(--fg)/.45)] active:scale-[.99] ${className}`;
  if (href)
    return (
      <a href={href} className={base}>
        {icono}
        {children}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={base}>
      {icono}
      {children}
    </button>
  );
}
