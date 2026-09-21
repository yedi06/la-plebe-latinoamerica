'use client';

import { useState } from 'react';
import { LOGOS_DISPONIBLES } from '@/lib/data';
import { rutaPublica } from '@/lib/ruta';

/**
 * Logotipo de un medio de pago.
 *
 * Todos los archivos de `public/logos/` están normalizados al mismo lienzo
 * (240 × 96 px, fondo blanco, logo centrado al 88%), así que basta con fijar la
 * altura: la fila queda alineada sola y ningún logo se ve más grande que otro.
 *
 * El fondo blanco viene incrustado a propósito. Los logotipos de marca no se
 * pueden recolorear, y varios son oscuros: sobre el negro de La Plebe
 * desaparecerían. La pastilla blanca es además como los muestran las pasarelas.
 *
 * Si la marca todavía no tiene archivo (Visa, Mastercard, Amex, Diners), cae a
 * un recuadro tipográfico en vez de a un hueco.
 */
export function LogoPago({
  id,
  nombre,
  alto = 'h-8',
  cubrir = false,
  className = '',
}: {
  id: string;
  nombre: string;
  alto?: string;
  /** El logo llena su contenedor en vez de flotar dentro de él. */
  cubrir?: boolean;
  className?: string;
}) {
  const [falla, setFalla] = useState(false);
  const hayArchivo = LOGOS_DISPONIBLES.includes(id);

  if (!hayArchivo || falla) {
    return (
      <span
        title={`Logotipo de ${nombre} pendiente — ver LOGOS-Y-MEDIOS.md`}
        className={`inline-flex ${cubrir ? 'h-full w-full justify-center' : alto} items-center text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--fg-muted))] ${className}`}
      >
        {nombre}
      </span>
    );
  }

  return (
    // Los archivos vienen recortados al ras, sin lienzo ni relleno: con
    // `object-contain` al 100% el logo toca los bordes de su casilla.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={rutaPublica(`/logos/${id}.png`)}
      alt={nombre}
      onError={() => setFalla(true)}
      loading="lazy"
      decoding="async"
      className={
        cubrir
          ? `h-full w-full object-contain ${className}`
          : `${alto} w-auto object-contain ${className}`
      }
    />
  );
}

/**
 * Fila de medios que va DENTRO del botón principal de donar.
 *
 * Ver el logo del medio que uno ya usa, antes de tocar el botón, es lo que
 * baja la duda: el donante sabe de antemano que podrá pagar como siempre paga.
 *
 * Sin pastilla blanca: el logo va directo sobre el degradado del botón.
 */
export function LogosEnBoton({ className = '' }: { className?: string }) {
  /*
    Seis, no diez. Con diez se desbordaba a una segunda línea y dejaba un logo
    huérfano en móvil, que es lo que peor se ve. Estos seis caben en una sola
    fila a 375 px y cubren lo que de verdad usa la gente en Perú; el resto de
    medios aparece en el selector de pago, que es donde se eligen.
  */
  const medios = [
    { id: 'yape', nombre: 'Yape' },
    { id: 'plin', nombre: 'Plin' },
    { id: 'visa', nombre: 'Visa' },
    { id: 'mastercard', nombre: 'Mastercard' },
    { id: 'amex', nombre: 'American Express' },
  ];
  return (
    <span className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${className}`}>
      {medios.map((m) => (
        <LogoPago key={m.id} id={m.id} nombre={m.nombre} alto="h-[14px]" />
      ))}
      <span className="text-[10.5px] font-semibold text-ink/55">y más</span>
    </span>
  );
}

/** Fila genérica de logos. */
export function FilaLogos({
  items,
  alto = 'h-7',
  className = '',
}: {
  items: { id: string; nombre: string }[];
  alto?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((m) => (
        <LogoPago key={m.id} id={m.id} nombre={m.nombre} alto={alto} />
      ))}
    </div>
  );
}
