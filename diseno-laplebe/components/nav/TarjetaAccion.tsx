'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BRAND, type TarjetaAccion as Tarjeta } from '@/lib/data';
import { IconoTarjeta } from '@/components/brand/Marca';
import { EASE } from '@/components/motion';

/**
 * Tarjeta de acción — la única pieza repetida de la interfaz.
 *
 * Es una fila editorial: icono de trazo fino, título, una línea de apoyo y una
 * flecha. Sin etiquetas de color, sin halos, sin contenedores redondeados.
 *
 * Se alimenta de `TARJETAS` en `lib/data.ts`: agregar una es agregar un objeto
 * a esa lista. Este componente no se toca para eso.
 */
export function TarjetaAccionUI({
  tarjeta,
  onDonar,
  onSeccion,
  className = '',
}: {
  tarjeta: Tarjeta;
  onDonar?: (t: Tarjeta) => void;
  onSeccion?: (href: string) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const destacada = Boolean(tarjeta.destacada);

  const interior = (
    <>
      {destacada && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-turq via-lime to-turq bg-[length:220%_auto] motion-safe:animate-gradient-pan"
        />
      )}

      <span className={`shrink-0 ${destacada ? 'text-ink' : 'text-[rgb(var(--accent))]'}`}>
        <IconoTarjeta tipo={tarjeta.icono} className={destacada ? 'h-7 w-7' : 'h-6 w-6'} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block font-display uppercase leading-[0.95] tracking-tight text-balance ${
            destacada ? 'text-[clamp(1.25rem,5vw,1.6rem)] text-ink' : 'text-[15px] sm:text-[17px]'
          }`}
        >
          {tarjeta.titulo}
        </span>
        <span
          className={`mt-1 block text-[12px] leading-snug ${
            destacada ? 'text-ink/70' : 'text-[rgb(var(--fg-muted))]'
          }`}
        >
          {tarjeta.bajada}
        </span>
      </span>

      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
          destacada ? 'text-ink' : 'text-[rgb(var(--fg-muted))]'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 12h13M13 6l6 6-6 6" />
      </svg>
    </>
  );

  const base = `group relative isolate flex w-full items-center gap-4 px-4 text-left ${
    destacada
      ? 'py-5 sm:py-6'
      : 'border-t border-[rgb(var(--line)/var(--line-a))] py-4 transition-colors hover:bg-[rgb(var(--fg)/.04)]'
  }`;

  const contenido =
    tarjeta.accion === 'enlace' || tarjeta.accion === 'whatsapp' ? (
      <a
        href={tarjeta.accion === 'whatsapp' ? BRAND.whatsappLink : tarjeta.href ?? '#'}
        className={base}
      >
        {interior}
      </a>
    ) : (
      <button
        type="button"
        onClick={() =>
          tarjeta.accion === 'seccion' ? onSeccion?.(tarjeta.href ?? '#') : onDonar?.(tarjeta)
        }
        className={base}
      >
        {interior}
      </button>
    );

  return (
    <motion.div
      whileHover={reduce || !destacada ? undefined : { y: -2 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={className}
    >
      {contenido}
    </motion.div>
  );
}
