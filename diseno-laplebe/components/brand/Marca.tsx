'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { BRAND } from '@/lib/data';
import { rutaPublica } from '@/lib/ruta';

/* ==========================================================================
   Avatar — foto real del perfil con el trazo lima del kit
   ========================================================================== */
export function AvatarMarca({
  size = 'md',
  ring = true,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
}) {
  const px = {
    sm: 'h-14 w-14',
    md: 'h-[76px] w-[76px]',
    lg: 'h-24 w-24 sm:h-28 sm:w-28',
    xl: 'h-32 w-32 sm:h-40 sm:w-40',
  }[size];

  return (
    <div className={`relative shrink-0 ${px}`}>
      {ring && (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-12" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="212 34"
          />
        </svg>
      )}
      <div className={`absolute overflow-hidden rounded-full ${ring ? 'inset-[7px]' : 'inset-0'}`}>
        <img
          src={rutaPublica("/perfil-laplebe.jpg")}
          alt="La Plebe Latinoamérica"
          width={1080}
          height={1080}
          loading="eager"
          decoding="async"
          className="h-full w-full scale-[1.06] object-cover object-[50%_38%]"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   Claim de marca — marcador + trazo lima
   ========================================================================== */
export function Claim({
  className = '',
  texto = BRAND.claim,
  highlight = 'nosotros sí.',
}: {
  className?: string;
  /** Frase completa a mostrar. Por defecto, el claim principal de marca. */
  texto?: string;
  highlight?: string;
}) {
  const [antes, despues] = texto.split(highlight);
  return (
    <p className={`font-marker leading-[1.05] ${className}`}>
      {antes}
      <span className="brush-underline relative z-[1]">{highlight}</span>
      {despues}
    </p>
  );
}

/* ==========================================================================
   Título de sección — sólo tipografía y una línea fina. Sin kickers de color.
   ========================================================================== */
export function Titulo({
  numero,
  children,
  bajada,
  className = '',
}: {
  /** Numeral editorial opcional (01, 02…). Da estructura sin recurrir a etiquetas. */
  numero?: string;
  children: ReactNode;
  bajada?: string;
  className?: string;
}) {
  return (
    <div className={`border-t border-[rgb(var(--line)/var(--line-a))] pt-4 ${className}`}>
      <div className="flex items-baseline gap-4">
        {numero && (
          <span className="font-display text-[13px] tabular-nums text-[rgb(var(--fg-muted))]">
            {numero}
          </span>
        )}
        <h2 className="font-display text-[clamp(1.7rem,6.5vw,3rem)] uppercase leading-[0.9] tracking-[-.015em] text-balance">
          {children}
        </h2>
      </div>
      {bajada && (
        <p className="mt-2.5 max-w-[56ch] text-[14px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
          {bajada}
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   Dato suelto — reemplaza a las píldoras de confianza
   ========================================================================== */
export function Datos({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <p className={`text-[12.5px] text-[rgb(var(--fg-muted))] ${className}`}>
      {items.map((t, i) => (
        <span key={t}>
          {i > 0 && <span className="mx-2 text-[rgb(var(--fg-muted))]/50">/</span>}
          {t}
        </span>
      ))}
    </p>
  );
}

/* ==========================================================================
   Iconos de los frentes (trazo fino, sin contenedor de color)
   ========================================================================== */
/**
 * Iconos de los frentes. Sólidos, no de trazo: el kit media usa siluetas llenas
 * (corazón, gente, cerros, hoja) y ese es el peso visual de la marca.
 */
export function IconoFrente({
  tipo,
  className = 'h-6 w-6',
}: {
  tipo: 'olla' | 'corazon' | 'birrete';
  className?: string;
}) {
  if (tipo === 'olla')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        {/* Cubiertos: el mismo símbolo del badge de Alimentación del kit */}
        <path d="M7.1 2.4a.85.85 0 0 1 .85.85v4.1h.75v-4.1a.85.85 0 1 1 1.7 0v4.1h.75v-4.1a.85.85 0 1 1 1.7 0V8.1c0 1.32-.9 2.43-2.12 2.75V20.8a1.1 1.1 0 0 1-2.2 0v-9.95A2.85 2.85 0 0 1 6.25 8.1V3.25a.85.85 0 0 1 .85-.85zM16.9 2.4c1.5 0 2.55 2.03 2.55 5 0 2.3-.63 4-1.6 4.63V20.8a1.1 1.1 0 0 1-2.2 0v-8.77c-.97-.63-1.6-2.33-1.6-4.63 0-2.97 1.05-5 2.85-5z" />
      </svg>
    );
  if (tipo === 'corazon')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M12 21.2s-8.6-5.2-8.6-11A5 5 0 0 1 12 7.1a5 5 0 0 1 8.6 3.1c0 5.8-8.6 11-8.6 11z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3 1.6 7.9 12 12.8l10.4-4.9z" />
      <path d="M5.6 11.1v4.4c0 1.9 2.87 3.4 6.4 3.4s6.4-1.5 6.4-3.4v-4.4L12 14.3z" />
      <path d="M21.6 9.3v5a.8.8 0 0 1-1.6 0v-5z" />
    </svg>
  );
}

export function IconoTarjeta({
  tipo,
  className = 'h-6 w-6',
}: {
  tipo: 'olla' | 'corazon' | 'birrete' | 'rayo' | 'repetir' | 'maletin' | 'play';
  className?: string;
}) {
  if (tipo === 'olla' || tipo === 'corazon' || tipo === 'birrete')
    return <IconoFrente tipo={tipo} className={className} />;

  if (tipo === 'rayo')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M13.9 1.8 4.2 14.1h5.9l-.9 8.1 10.6-12.6h-6.4z" />
      </svg>
    );
  if (tipo === 'repetir')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M12 4.2c2.5 0 4.7 1.3 6 3.2l-2 1.5h5.4V3.6l-1.9 1.4A9.4 9.4 0 0 0 2.7 11h2.5A6.9 6.9 0 0 1 12 4.2zM12 19.8a6.9 6.9 0 0 1-6-3.5l2-1.5H2.6v5.3l1.9-1.4a9.4 9.4 0 0 0 16.8-5.6h-2.5a6.9 6.9 0 0 1-6.8 6.7z" />
      </svg>
    );
  if (tipo === 'maletin')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M9.6 3.2h4.8a2.6 2.6 0 0 1 2.6 2.6v1.4h-2.2V5.8a.4.4 0 0 0-.4-.4H9.6a.4.4 0 0 0-.4.4v1.4H7V5.8a2.6 2.6 0 0 1 2.6-2.6z" />
        <path d="M2.4 8.8h19.2v3.4H2.4zM2.4 13.9h19.2v5.3a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2zM9.8 7.9 16.4 12l-6.6 4.1z" />
    </svg>
  );
}

/* ==========================================================================
   Iconos sociales / contacto
   ========================================================================== */
export function IconTikTok({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3v13.1a2.6 2.6 0 1 1-2.1-2.6V9.4a5.7 5.7 0 1 0 5.1 5.7V8.5a6.4 6.4 0 0 0 3.9 1.3V6.7a3.6 3.6 0 0 1-3.9-3.5V2z" />
    </svg>
  );
}
export function IconWhatsApp({ className = 'h-5 w-5' }: { className?: string }) {
  return <FaWhatsapp className={className} aria-hidden />;
}
export function IconMail({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M2.4 6.6 12 13.2l9.6-6.6a1.7 1.7 0 0 0-1.5-.9H3.9a1.7 1.7 0 0 0-1.5.9z" />
      <path d="M22 8.6 12 15.5 2 8.6v8.7c0 1 .8 1.7 1.7 1.7h16.6c1 0 1.7-.8 1.7-1.7z" />
    </svg>
  );
}

/* ==========================================================================
   Nombre de un medio de pago.
   Placeholder tipográfico sobrio — el logotipo oficial se coloca en producción.
   ========================================================================== */
export function MarcaPago({ nombre, className = '' }: { nombre: string; className?: string }) {
  return (
    <span
      className={`font-display text-[15px] uppercase tracking-[.02em] text-[rgb(var(--fg))] ${className}`}
    >
      {nombre}
    </span>
  );
}

/* ==========================================================================
   Toggle claro / oscuro — flotante, no es un navbar
   ========================================================================== */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    const leer = () => setDark(raiz.classList.contains('dark'));
    leer();
    const obs = new MutationObserver(leer);
    obs.observe(raiz, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      window.localStorage.setItem('lp-theme', next ? 'dark' : 'light');
    } catch {
      /* modo privado */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--line)/var(--line-a))] bg-[rgb(var(--bg)/.7)] text-[rgb(var(--fg))] backdrop-blur-xl transition hover:border-[rgb(var(--fg)/.35)] ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.8v2M12 19.2v2M4.4 4.4l1.4 1.4M18.2 18.2l1.4 1.4M2.8 12h2M19.2 12h2M4.4 19.6l1.4-1.4M18.2 5.8l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.2 8.2 0 1 0 20 14.2z" />
        )}
      </svg>
    </button>
  );
}

/* ==========================================================================
   Enlace de vuelta al índice de propuestas
   ========================================================================== */
export function VolverAPropuestas({ className = '' }: { className?: string }) {
  return (
    <a
      href="/"
      className={`inline-flex h-9 items-center rounded-full border border-[rgb(var(--line)/var(--line-a))] bg-[rgb(var(--bg)/.7)] px-3.5 text-[11px] font-semibold backdrop-blur-xl transition hover:border-[rgb(var(--fg)/.35)] ${className}`}
    >
      <span aria-hidden>←</span>
      <span className="ml-1.5 hidden sm:inline">Propuestas</span>
      <span className="sr-only">Volver al índice de propuestas</span>
    </a>
  );
}
