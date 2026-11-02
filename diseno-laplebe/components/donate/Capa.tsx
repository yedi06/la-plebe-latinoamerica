'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { rutaPublica } from '@/lib/ruta';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/** Lo que dura la salida en CSS. Pasado este tiempo la capa se desmonta sí o sí. */
const SALIDA_MS = 280;

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary';

/**
 * Ventana sobre la página: hoja inferior en móvil, panel centrado en escritorio.
 * En escritorio lleva un grabado al costado, sobre el mismo papel de la web.
 *
 * Va con transición CSS y un temporizador, no con AnimatePresence de Framer
 * Motion: su salida a veces no terminaba y dejaba el fondo invisible encima de
 * la página, tragándose todos los clics. Igual que la cortina de `page.tsx`, una
 * salida no puede depender de que una animación llegue a su final.
 */
export function Capa({
  abierta,
  onClose,
  etiqueta,
  arte,
  children,
}: {
  abierta: boolean;
  onClose: () => void;
  etiqueta: string;
  arte?: { src: string; ancho: number; alto: number; leyenda: string };
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cerrar = useRef(onClose);
  cerrar.current = onClose;
  const [montada, setMontada] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (abierta) {
      setMontada(true);
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    }
    setVisible(false);
    const t = setTimeout(() => setMontada(false), SALIDA_MS);
    return () => clearTimeout(t);
  }, [abierta]);

  // Bloquea el fondo, cierra con Escape y mantiene el foco dentro de la ventana.
  useEffect(() => {
    if (!abierta) return;
    const previo = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cerrar.current();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const lista = panelRef.current.querySelectorAll<HTMLElement>(ENFOCABLES);
      if (lista.length === 0) return;
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && (document.activeElement === primero || document.activeElement === panelRef.current)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      previo?.focus?.({ preventScroll: true });
    };
  }, [abierta]);

  useEffect(() => {
    if (abierta && montada) panelRef.current?.focus({ preventScroll: true });
  }, [abierta, montada]);

  if (!montada) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center sm:items-center ${
        visible ? '' : 'pointer-events-none'
      }`}
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 bg-ink/75 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={etiqueta}
        style={{ backgroundImage: `url(${rutaPublica('/img/papel.webp')})`, backgroundSize: '500px' }}
        className={`papel relative flex max-h-[92svh] w-full max-w-[520px] overflow-hidden rounded-t-[18px] bg-[rgb(var(--bg))] shadow-lift outline-none transition duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)] sm:max-h-[88svh] sm:rounded-none ${
          arte ? 'md:max-w-[880px]' : ''
        } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 sm:translate-y-6'}`}
      >
        {arte && (
          <figure className={`hidden w-[340px] shrink-0 flex-col justify-center border-r ${HAIRLINE} p-7 md:flex`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rutaPublica(arte.src)}
              alt=""
              width={arte.ancho}
              height={arte.alto}
              className="grabado h-auto w-full"
            />
            <figcaption className="mt-4 font-marker text-[26px] leading-none">{arte.leyenda}</figcaption>
          </figure>
        )}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

/** Cabecera de las ventanas: sobre el papel, con la misma voz de la página. */
export function CabeceraCapa({
  linea,
  titulo,
  bajada,
  onClose,
  children,
}: {
  /** Una línea corta bajo el nombre de la organización. */
  linea: string;
  titulo: string;
  bajada?: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <div className={`shrink-0 border-b ${HAIRLINE} px-5 pb-4 pt-3`}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[12px] uppercase leading-none tracking-[.02em]">
            La Plebe Latinoamérica
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-[rgb(var(--fg-muted))]">{linea}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-[rgb(var(--fg-muted))] transition hover:bg-[rgb(var(--fg)/.06)] hover:text-[rgb(var(--fg))]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <h2 className="mt-2 font-display text-[clamp(1.4rem,5.5vw,1.85rem)] uppercase leading-none tracking-[-.03em]">
        {titulo}
      </h2>
      {bajada && <p className="mt-2 text-[13.5px] leading-snug text-[rgb(var(--fg-muted))]">{bajada}</p>}
      {children}
    </div>
  );
}
