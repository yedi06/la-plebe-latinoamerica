'use client';

import { useEffect, useRef, useState } from 'react';
import { MediaPlaceholder } from '@/components/brand/MediaPlaceholder';

/**
 * Reproductor oficial de TikTok en iframe.
 *
 * Se usa `tiktok.com/player/v1/{id}` y no el clásico `blockquote` + `embed.js`
 * porque aquel trae toda la tarjeta (avatar, descripción, música) y tiene un
 * ancho mínimo de 325 px: dentro de una celda de grilla de ~230 px se recorta y
 * se deforma. El reproductor v1 es 9:16 puro y escala al contenedor.
 *
 * Ventajas frente a descargar el archivo de video:
 *  - las vistas siguen contando en @la.plebe_latinoamerica;
 *  - no hay que alojar ni pagar el ancho de banda;
 *  - si el video se edita o se borra en TikTok, la web se actualiza sola.
 */

const PARAMS = new URLSearchParams({
  // Quitamos el cromo que compite con el diseño; el video manda.
  music_info: '0',
  description: '0',
  rel: '0',
  native_context_menu: '0',
  closed_caption: '0',
  autoplay: '0',
  loop: '1',
}).toString();

function idDesdeUrl(url: string) {
  return url.match(/\/video\/(\d+)/)?.[1] ?? null;
}

export function TikTokEmbed({
  url,
  etiqueta,
  descripcion,
  className = '',
}: {
  url: string;
  etiqueta: string;
  /** Texto del propio TikTok. Va debajo del video, no encima. */
  descripcion?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [listo, setListo] = useState(false);
  const id = idDesdeUrl(url);

  // Carga diferida: el iframe solo se monta cuando la grilla se acerca a pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!id) {
    return <MediaPlaceholder label={etiqueta} ratio="9/16" tone="dark" compact />;
  }

  return (
    <figure className={`group ${className}`}>
    <div
      ref={ref}
      className="relative overflow-hidden bg-ink ring-1 ring-[rgb(var(--line)/var(--line-a))] transition duration-500 group-hover:ring-[rgb(var(--accent-fill)/.6)]"
      style={{ aspectRatio: '9 / 16' }}
    >
      {/* Se mantiene debajo hasta que el reproductor confirma que cargó, para que
          nunca se vea un rectángulo negro vacío. */}
      {!listo && (
        <div className="absolute inset-0">
          <MediaPlaceholder label={etiqueta} ratio="9/16" tone="dark" compact fill />
        </div>
      )}

      {visible && (
        <iframe
          src={`https://www.tiktok.com/player/v1/${id}?${PARAMS}`}
          title={etiqueta}
          onLoad={() => setListo(true)}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
          style={{ opacity: listo ? 1 : 0, transition: 'opacity .4s ease' }}
        />
      )}
    </div>
    {descripcion && (
      <figcaption className="relative mt-4 pl-4">
        {/* Filete de acento a la izquierda: da estructura sin encerrar el texto
            en una caja, que es lo que apelmazaba la galeria. */}
        <span
          aria-hidden
          className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[2px] bg-[rgb(var(--accent-fill)/.55)] transition-colors duration-500 group-hover:bg-[rgb(var(--accent-fill))]"
        />
        <p className="font-display text-[14px] uppercase leading-[1.05] tracking-[-.02em]">
          {etiqueta}
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
          {descripcion}
        </p>
      </figcaption>
    )}
    </figure>
  );
}

/** Grilla de shorts. Sin URLs cargadas, muestra los espacios reservados. */
export function GrillaTikTok({
  videos,
  className = '',
  limite,
  conDescripcion = false,
  columnas = 'grid-cols-2 sm:grid-cols-4',
}: {
  videos: { url: string; etiqueta: string; descripcion?: string }[];
  className?: string;
  /** Cuántos mostrar. Sin límite, se muestran todos. */
  limite?: number;
  conDescripcion?: boolean;
  columnas?: string;
}) {
  const vacios = [
    'Espacio para short — entrega de víveres',
    'Espacio para short — caso médico',
    'Espacio para short — kits escolares',
    'Espacio para short — testimonio',
  ];

  /*
    Dos columnas en móvil y cuatro desde `sm`. Por debajo de ~200 px de ancho el
    reproductor de TikTok deja de ser legible, así que no se baja de ahí.
  */
  const grilla = `grid gap-x-4 gap-y-10 ${columnas} ${className}`;
  const lista = typeof limite === 'number' ? videos.slice(0, limite) : videos;

  if (videos.length === 0) {
    return (
      <div className={grilla}>
        {vacios.map((l) => (
          <MediaPlaceholder key={l} label={l} ratio="9/16" tone="dark" compact />
        ))}
      </div>
    );
  }

  return (
    <div className={grilla}>
      {lista.map((v) => (
        <TikTokEmbed
          key={v.url}
          url={v.url}
          etiqueta={v.etiqueta}
          descripcion={conDescripcion ? v.descripcion : undefined}
        />
      ))}
    </div>
  );
}
